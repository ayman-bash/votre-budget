import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../composants/nav';
import Footer from '../composants/footer';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: '',
    date: '',
    notes: '',
  });
  const [editingExpense, setEditingExpense] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/expenses', { withCredentials: true });
      setExpenses(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des dépenses:', error.response?.data || error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExpense) {
        await axios.put(`http://localhost:5000/expenses/${editingExpense._id}`, newExpense, {
          withCredentials: true,
        });
      } else {
        await axios.post('http://localhost:5000/expenses', newExpense, {
          withCredentials: true,
        });
      }

      setNewExpense({ description: '', amount: '', category: '', date: '', notes: '' });
      setEditingExpense(null);
      fetchExpenses();
    } catch (error) {
      console.error("Erreur lors de l'envoi de la dépense:", error.response?.data || error.message);
    }
  };

  const deleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/expenses/${id}`, { withCredentials: true });
      fetchExpenses();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error.response?.data || error.message);
    }
  };

  const filteredExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getFullYear() === selectedYear &&
      (selectedMonth === "" || expDate.getMonth() === Number(selectedMonth));
  });

  const formatExpenseDataByMonth = () => {
    const monthlyTotals = {};
    filteredExpenses.forEach((exp) => {
      const date = new Date(exp.date);
      const year = date.getFullYear();
      const monthIndex = date.getMonth();
      const monthKey = `${year}-${monthIndex}`;
      monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + exp.amount;
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

  const getCategoryData = () => {
    const result = {};
    filteredExpenses.forEach((exp) => {
      result[exp.category] = (result[exp.category] || 0) + exp.amount;
    });

    return Object.entries(result).map(([name, value]) => ({ name, value }));
  };

  const exportCSV = () => {
    const rows = filteredExpenses.map(exp =>
      [exp.description, exp.amount, exp.category, exp.date].join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + ["Description,Montant,Catégorie,Date", ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `depenses_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
  };
  const exportPDF = () => {
    import('jspdf').then(jsPDF => {
      const doc = new jsPDF.default();
      doc.setFontSize(14);
      doc.text(`Dépenses - ${selectedMonth ? `Mois ${Number(selectedMonth) + 1}` : 'Année'} ${selectedYear}`, 20, 20);
  
      let y = 30;
      filteredExpenses.forEach((exp, index) => {
        const line = `${index + 1}. ${exp.description} - ${exp.amount}€ - ${exp.category} - ${new Date(exp.date).toLocaleDateString()}`;
        doc.text(line, 20, y);
        y += 10;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
  
      doc.save(`depenses_${selectedYear}${selectedMonth !== "" ? `_mois${Number(selectedMonth) + 1}` : ""}.pdf`);
    });
  };
  
  const COLORS = ["#ff4d4d", "#ff6b6b", "#ff8787", "#ffa8a8", "#ffc9c9"];

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h2 className="fw-bold text-center text-danger">💳 Gestion des Dépenses</h2>

        <div className="d-flex gap-3 mb-3">
          <select className="form-select w-auto" onChange={(e) => setSelectedYear(Number(e.target.value))} value={selectedYear}>
            {[...new Set(expenses.map(e => new Date(e.date).getFullYear()))].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select className="form-select w-auto" onChange={(e) => setSelectedMonth(e.target.value)} value={selectedMonth}>
            <option value="">Tous les mois</option>
            {Array.from({ length: 12 }, (_, i) =>
              new Date(2000, i).toLocaleString('default', { month: 'short' })
            ).map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
        </div>

        <div className="card p-4 my-4 border-danger">
          <h5 className="fw-bold text-danger">{editingExpense ? 'Modifier une dépense' : 'Ajouter une dépense'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Description"
                  required
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                />
              </div>
              <div className="col-md-2">
                <input
                  type="number"
                  className="form-control"
                  placeholder="Montant"
                  required
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  required
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                >
                  <option value="">Catégorie</option>
                  <option value="Alimentation">Alimentation</option>
                  <option value="Loyer">Loyer</option>
                  <option value="Transport">Transport</option>
                  <option value="Loisirs">Loisirs</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div className="col-md-2">
                <input
                  type="date"
                  className="form-control"
                  required
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                />
              </div>
              <div className="col-md-2">
                <button type="submit" className={`btn w-100 ${editingExpense ? 'btn-warning' : 'btn-danger'}`}>
                  {editingExpense ? 'Mettre à jour' : 'Ajouter'}
                </button>
              </div>
            </div>
          </form>

          {editingExpense && (
            <div className="row mt-3">
              <div className="col-md-2 offset-md-10">
                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={() => {
                    setEditingExpense(null);
                    setNewExpense({ description: '', amount: '', category: '', date: '', notes: '' });
                  }}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="card p-4 border-danger">
          <h5 className="fw-bold text-danger">Dépenses enregistrées</h5>
          {filteredExpenses.length > 0 ? (
            <motion.table
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="table table-hover"
            >
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Montant</th>
                  <th>Catégorie</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp, index) => (
                  <motion.tr
                    key={exp._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <td>{exp.description}</td>
                    <td>{exp.amount}€</td>
                    <td>{exp.category}</td>
                    <td>{new Date(exp.date).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm me-2"
                        onClick={() => {
                          setNewExpense({
                            description: exp.description,
                            amount: exp.amount,
                            category: exp.category,
                            date: exp.date.split('T')[0],
                            notes: exp.notes || ''
                          });
                          setEditingExpense(exp);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        ✏️ Modifier
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteExpense(exp._id)}>
                        🗑 Supprimer
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </motion.table>
          ) : (
            <p className="text-muted">Aucune dépense enregistrée pour cette période.</p>
          )}
        </div>

        <div className="card p-4 my-4 border-danger">
          <h5 className="fw-bold text-danger">📉 Évolution Mensuelle</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formatExpenseDataByMonth()}>
              <XAxis dataKey="month" stroke="#ff4d4d" />
              <YAxis stroke="#ff4d4d" />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="total" fill="#ff4d4d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4 my-4 border-danger">
  <h5 className="fw-bold text-danger">📊 Répartition des Catégories</h5>
  <ResponsiveContainer width="100%" height={300}>
    <PieChart>
      <Pie
        dataKey="value"
        data={getCategoryData()}
        cx="50%"
        cy="50%"
        outerRadius={120}
        labelLine={false}
        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
        fill="#ff4d4d"
      >
        {getCategoryData().map((entry, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
</div>


        <div className="text-center mt-4">
          <h5 className="fw-bold text-danger">📤 Exporter</h5>
          <button className="btn btn-primary" onClick={exportCSV}>📂 Export CSV</button>
          <button className="btn btn-danger mx-2" onClick={exportPDF}>📄 Export PDF</button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Expenses;
