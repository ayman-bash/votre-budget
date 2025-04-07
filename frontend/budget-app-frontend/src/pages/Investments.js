import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../composants/nav';
import Footer from '../composants/footer';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Investments = () => {
  const [investments, setInvestments] = useState([]);
  const [newInvestment, setNewInvestment] = useState({
    type: '',
    amount: '',
    currentValue: '',
    date: '',
    notes: ''
  });
  const [editingInvestment, setEditingInvestment] = useState(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('');

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/investments', { withCredentials: true });
      setInvestments(response.data);
    } catch (error) {
      console.error('Erreur chargement investissements:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingInvestment) {
        await axios.put(`http://localhost:5000/investments/${editingInvestment._id}`, newInvestment, { withCredentials: true });
      } else {
        await axios.post('http://localhost:5000/investments', newInvestment, { withCredentials: true });
      }
      setNewInvestment({ type: '', amount: '', currentValue: '', date: '', notes: '' });
      setEditingInvestment(null);
      fetchInvestments();
    } catch (error) {
      console.error("Erreur enregistrement investissement:", error);
    }
  };

  const deleteInvestment = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/investments/${id}`, { withCredentials: true });
      fetchInvestments();
    } catch (error) {
      console.error("Erreur suppression investissement:", error);
    }
  };

  const filteredInvestments = investments.filter(inv => {
    const d = new Date(inv.date);
    return d.getFullYear() === selectedYear && (selectedMonth === '' || d.getMonth() === Number(selectedMonth));
  });

  const exportCSV = () => {
    const rows = filteredInvestments.map(inv => [inv.type, inv.amount, inv.currentValue, inv.date].join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + ['Type,Investi,Actuel,Date', ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `investissements_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  const exportPDF = () => {
    import('jspdf').then(jsPDF => {
      const doc = new jsPDF.default();
      doc.text(`Investissements - ${selectedMonth ? `Mois ${Number(selectedMonth) + 1}` : 'Année'} ${selectedYear}`, 20, 20);
      let y = 30;
      filteredInvestments.forEach((inv, i) => {
        const line = `${i + 1}. ${inv.type} - Investi: ${inv.amount}€ / Actuel: ${inv.currentValue}€ - ${new Date(inv.date).toLocaleDateString()}`;
        doc.text(line, 20, y);
        y += 10;
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
      });
      doc.save(`investissements_${selectedYear}${selectedMonth !== '' ? `_mois${Number(selectedMonth) + 1}` : ''}.pdf`);
    });
  };

  const COLORS = ['#4ade80', '#22c55e', '#16a34a', '#15803d'];

  const getTypeData = () => {
    const result = {};
    filteredInvestments.forEach((inv) => {
      result[inv.type] = (result[inv.type] || 0) + inv.currentValue;
    });
    return Object.entries(result).map(([name, value]) => ({ name, value }));
  };

  const getMonthlyEvolution = () => {
    const result = {};
    filteredInvestments.forEach((inv) => {
      const date = new Date(inv.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      result[key] = (result[key] || 0) + (inv.currentValue - inv.amount);
    });
    return Object.entries(result).map(([key, value]) => {
      const [year, month] = key.split('-').map(Number);
      return {
        month: new Date(year, month).toLocaleString('default', { month: 'short', year: 'numeric' }),
        gain: value
      };
    });
  };

  // Charger le SDK PayPal
  useEffect(() => {
    const loadPaypalScript = async () => {
      if (document.getElementById('paypal-sdk')) return;

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=ART50ZLUTRsApktCVHMF4i4KzbbnM7o5b80o6tpHwODyTaxZGHaxkFzoWf_P9DStGm4OmmEV9dYB0kJs&currency=USD&debug=true`; 
      script.id = 'paypal-sdk';
      script.async = true;
      script.onload = () => {
        if (window.paypal) {
          window.paypal.Buttons({
            createOrder: (data, actions) => {
              return actions.order.create({
                purchase_units: [{
                  amount: {
                    value: '9.99'
                  }
                }]
              });
            },
            onApprove: (data, actions) => {
              return actions.order.capture().then((details) => {
                alert(`Merci ${details.payer.name.given_name} pour votre soutien ! 🎉`);
                window.location.href = '/thank-you'; 
              });
            },
            onError: (err) => {
              console.error('Erreur Paypal:', err);
              alert('Une erreur est survenue lors de la transaction.');
            }
          }).render('#paypal-button-container');
        }
      };
      document.body.appendChild(script);
    };

    loadPaypalScript();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h2 className="fw-bold text-center text-success">📈 Gestion des Investissements</h2>

        {/* Filtres */}
        <div className="d-flex gap-3 mb-3">
          <select className="form-select w-auto" onChange={(e) => setSelectedYear(Number(e.target.value))} value={selectedYear}>
            {[...new Set(investments.map(i => new Date(i.date).getFullYear()))].map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>

          <select className="form-select w-auto" onChange={(e) => setSelectedMonth(e.target.value)} value={selectedMonth}>
            <option value="">Tous les mois</option>
            {Array.from({ length: 12 }, (_, i) => new Date(2000, i).toLocaleString('default', { month: 'short' })).map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
        </div>

        {/* Formulaire Ajout */}
        <div className="card p-4 my-4">
          <h5 className="fw-bold">{editingInvestment ? 'Modifier un investissement' : 'Ajouter un investissement'}</h5>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-3">
              <select className="form-select" required value={newInvestment.type} onChange={(e) => setNewInvestment({ ...newInvestment, type: e.target.value })}>
                <option value="">Type</option>
                <option value="Bourse">Bourse</option>
                <option value="Crypto">Crypto</option>
                <option value="Immobilier">Immobilier</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
            <div className="col-md-2">
              <input type="number" className="form-control" placeholder="Investi" required value={newInvestment.amount} onChange={(e) => setNewInvestment({ ...newInvestment, amount: e.target.value })} />
            </div>
            <div className="col-md-2">
              <input type="number" className="form-control" placeholder="Actuel" required value={newInvestment.currentValue} onChange={(e) => setNewInvestment({ ...newInvestment, currentValue: e.target.value })} />
            </div>
            <div className="col-md-3">
              <input type="date" className="form-control" required value={newInvestment.date} onChange={(e) => setNewInvestment({ ...newInvestment, date: e.target.value })} />
            </div>
            <div className="col-md-2">
              <button type="submit" className={`btn w-100 ${editingInvestment ? 'btn-warning' : 'btn-success'}`}>
                {editingInvestment ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>

        {/* Tableau des Investissements */}
        <div className="card p-4">
          <h5 className="fw-bold">Investissements</h5>
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Investi (€)</th>
                <th>Actuel (€)</th>
                <th>Rentabilité (€)</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvestments.map((inv) => (
                <tr key={inv._id}>
                  <td>{inv.type}</td>
                  <td>{inv.amount}</td>
                  <td>{inv.currentValue}</td>
                  <td className={inv.currentValue - inv.amount >= 0 ? 'text-success' : 'text-danger'}>
                    {inv.currentValue - inv.amount}€
                  </td>
                  <td>{new Date(inv.date).toLocaleDateString()}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => {
                      setEditingInvestment(inv);
                      setNewInvestment({
                        type: inv.type,
                        amount: inv.amount,
                        currentValue: inv.currentValue,
                        date: inv.date.split('T')[0],
                        notes: inv.notes || ''
                      });
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}>✏️</button>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteInvestment(inv._id)}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Graphique Répartition par Type */}
        <div className="card p-4 my-4">
          <h5 className="fw-bold">Répartition par type</h5>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={getTypeData()} dataKey="value" cx="50%" cy="50%" outerRadius={120} label>
                {getTypeData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique Évolution Mensuelle */}
        <div className="card p-4 my-4">
          <h5 className="fw-bold">📊 Évolution Mensuelle des Gains</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getMonthlyEvolution()}>
              <XAxis dataKey="month" stroke="#15803d" />
              <YAxis stroke="#15803d" />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="gain" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="text-center mt-4">
          <button className="btn btn-outline-success me-2" onClick={exportCSV}>📂 Export CSV</button>
          <button className="btn btn-outline-danger" onClick={exportPDF}>📄 Export PDF</button>
        </div>

        <div className="container my-5">
  <h2 className="fw-bold text-center text-success mb-4">📚 Plus de renseignements sur l'investissement</h2>
  <p className="lead text-center text-muted">
    Accédez à nos guides experts et formations premium pour <strong>100$ par mois</strong>.
  </p>

  {/* Liste des Formations Offertes */}
  <div className="row my-4">
    <div className="col-md-6">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">📈 Stratégies d'investissement boursier</li>
        <li className="list-group-item">🏡 Investir dans l'immobilier locatif</li>
        <li className="list-group-item">💸 Gestion du risque financier</li>
      </ul>
    </div>
    <div className="col-md-6">
      <ul className="list-group list-group-flush">
        <li className="list-group-item">🌍 Diversification internationale des actifs</li>
        <li className="list-group-item">📊 Analyse des crypto-monnaies</li>
        <li className="list-group-item">🔥 Prévisions des tendances 2025</li>
      </ul>
    </div>
  </div>

  <div className="d-flex justify-content-center my-4">
  <div id="paypal-button-container" className="d-flex justify-content-center my-4"></div>
  </div>

  <p className="text-center text-muted small">
    Votre abonnement nous permet de vous offrir encore plus de contenus exclusifs et actualisés. Merci ! 🙏
  </p>
</div>

      </div>
      <Footer />
    </>
  );
};

export default Investments;
