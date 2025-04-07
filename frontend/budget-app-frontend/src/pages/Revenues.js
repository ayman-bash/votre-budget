import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../composants/nav';
import Footer from '../composants/footer';
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const Revenues = () => {
  const [revenues, setRevenues] = useState([]);
  const [newRevenue, setNewRevenue] = useState({
    source: '',
    amount: '',
    category: '',
    date: '',
    notes: '',
  });
  const [editingRevenue, setEditingRevenue] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    fetchRevenues();
  }, []);

  const fetchRevenues = async () => {
    try {
      const response = await axios.get('http://localhost:5000/revenues', {
        withCredentials: true,
      });
      setRevenues(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des revenus:', error.response?.data || error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRevenue) {
        await axios.put(`http://localhost:5000/revenues/${editingRevenue._id}`, newRevenue, {
          withCredentials: true,
        });
      } else {
        await axios.post('http://localhost:5000/revenues', newRevenue, {
          withCredentials: true,
        });
      }

      setNewRevenue({ source: '', amount: '', category: '', date: '', notes: '' });
      setEditingRevenue(null);
      fetchRevenues();
    } catch (error) {
      console.error("Erreur lors de l'envoi du revenu:", error.response?.data || error.message);
    }
  };

  const deleteRevenue = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/revenues/${id}`, {
        withCredentials: true,
      });
      fetchRevenues();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error.response?.data || error.message);
    }
  };

  const filteredRevenues = revenues.filter(rev => {
    const revDate = new Date(rev.date);
    return revDate.getFullYear() === selectedYear &&
      (selectedMonth === "" || revDate.getMonth() === Number(selectedMonth));
  });

  const formatRevenueDataByMonth = () => {
    const monthlyTotals = {};
    filteredRevenues.forEach((rev) => {
      const date = new Date(rev.date);
      const year = date.getFullYear();
      const monthIndex = date.getMonth();
      const monthKey = `${year}-${monthIndex}`;
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + rev.amount;
    });

    return Object.entries(monthlyTotals)
      .map(([key, total]) => {
        const [year, monthIndex] = key.split('-').map(Number);
        return {
          month: new Date(year, monthIndex).toLocaleString('default', { month: 'short', year: 'numeric' }),
          total,
          year,
          monthIndex
        };
      })
      .sort((a, b) => new Date(a.year, a.monthIndex) - new Date(b.year, b.monthIndex));
  };

  const exportCSV = () => {
    const rows = filteredRevenues.map(rev =>
      [rev.source, rev.amount, rev.category, rev.date].join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + ["Source,Montant,Catégorie,Date", ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `revenus_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const exportPDF = () => {
    import("jspdf").then(jsPDF => {
      const doc = new jsPDF.default();
      doc.text(`Revenus - ${selectedYear}`, 20, 20);
      let y = 30;
      filteredRevenues.forEach((rev, i) => {
        const line = `${rev.source}: ${rev.amount}€ (${rev.category})`;
        doc.text(line, 20, y);
        y += 10;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
      doc.save(`revenus_${selectedYear}.pdf`);
    });
  };

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h2 className="fw-bold text-center">💰 Gestion des Revenus</h2>

        <div className="d-flex gap-3 mb-3">
          <select className="form-select w-auto" onChange={(e) => setSelectedYear(Number(e.target.value))} value={selectedYear}>
            {[...new Set(revenues.map(r => new Date(r.date).getFullYear()))].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select className="form-select w-auto" onChange={(e) => setSelectedMonth(e.target.value)} value={selectedMonth}>
            <option value="">Tous les mois</option>
            {Array.from({ length: 12 }, (_, i) => new Date(2000, i).toLocaleString('default', { month: 'short' })).map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
        </div>

        <div className="card p-4 my-4">
          <h5 className="fw-bold">{editingRevenue ? 'Modifier le Revenu' : 'Ajouter un Revenu'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Source"
                  required
                  value={newRevenue.source}
                  onChange={(e) => setNewRevenue({ ...newRevenue, source: e.target.value })}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Montant"
                  required
                  value={newRevenue.amount}
                  onChange={(e) => setNewRevenue({ ...newRevenue, amount: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  required
                  value={newRevenue.category}
                  onChange={(e) => setNewRevenue({ ...newRevenue, category: e.target.value })}
                >
                  <option value="">Catégorie</option>
                  <option value="Salaire">Salaire</option>
                  <option value="Business">Business</option>
                  <option value="Investissement">Investissement</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div className="col-md-2">
                <input
                  type="date"
                  className="form-control"
                  required
                  value={newRevenue.date}
                  onChange={(e) => setNewRevenue({ ...newRevenue, date: e.target.value })}
                />
              </div>
              <div className="col-md-2">
                <button type="submit" className={`btn w-100 ${editingRevenue ? 'btn-warning' : 'btn-success'}`}>
                  {editingRevenue ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </div>
          </form>

          {editingRevenue && (
            <div className="row mt-3">
              <div className="col-md-2 offset-md-10">
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={() => {
                    setEditingRevenue(null);
                    setNewRevenue({ source: '', amount: '', category: '', date: '', notes: '' });
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="card p-4">
          <h5 className="fw-bold">Revenus enregistrés</h5>
          {filteredRevenues.length > 0 ? (
            <motion.table
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="table table-hover"
            >
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Montant</th>
                  <th>Catégorie</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRevenues.map((revenue, index) => (
                  <motion.tr
                    key={revenue._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td>{revenue.source}</td>
                    <td>{revenue.amount}€</td>
                    <td>{revenue.category}</td>
                    <td>{new Date(revenue.date).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => {
                          setNewRevenue({
                            source: revenue.source,
                            amount: revenue.amount,
                            category: revenue.category,
                            date: revenue.date.split('T')[0],
                            notes: revenue.notes || '',
                          });
                          setEditingRevenue(revenue);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        ✏️ Modifier
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteRevenue(revenue._id)}>
                        🗑 Supprimer
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          ) : (
            <p className="text-muted">Aucun revenu pour cette période.</p>
          )}
        </div>

        <div className="card p-4 my-4">
          <h5 className="fw-bold mb-3">📈 Évolution Mensuelle des Revenus</h5>
          {filteredRevenues.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatRevenueDataByMonth()}>
                <XAxis dataKey="month" stroke="#15803d" />
                <YAxis stroke="#15803d" />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Line type="monotone" dataKey="total" stroke="#22c55e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-muted">Pas encore de données à afficher.</p>
          )}
        </div>

        {/* 📤 Export */}
        <div className="text-center mt-4">
          <h5 className="fw-bold mb-3">📤 Exporter les Revenus</h5>
          <button className="btn btn-primary mx-2" onClick={exportCSV}>📂 Export CSV</button>
          <button className="btn btn-danger mx-2" onClick={exportPDF}>📄 Export PDF</button>
        </div>

        <style>{`
          .card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          }
          .btn-danger:hover {
            background-color: #dc3545;
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
};

export default Revenues;
