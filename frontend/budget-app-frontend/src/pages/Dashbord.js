import { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../composants/nav';
import Footer from '../composants/footer';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [revenues, setRevenues] = useState([]);
  const [investments, setInvestments] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [res1, res2, res3] = await Promise.all([
        axios.get('http://localhost:5000/expenses', { withCredentials: true }),
        axios.get('http://localhost:5000/revenues', { withCredentials: true }),
        axios.get('http://localhost:5000/investments', { withCredentials: true })
      ]);
      setExpenses(res1.data);
      setRevenues(res2.data);
      setInvestments(res3.data);
    } catch (error) {
      console.error('Erreur récupération données:', error);
    }
  };

  const total = (arr, field) => arr.reduce((sum, item) => sum + Number(item[field] || 0), 0);

  const investmentDiff = () => investments.reduce((sum, i) => sum + (i.currentValue - i.amount), 0);
  const incomeExpenseDiff = () => total(revenues, 'amount') - total(expenses, 'amount');

  const summary = [
    { label: 'Revenus', value: total(revenues, 'amount'), color: '#22c55e' },
    { label: 'Dépenses', value: total(expenses, 'amount'), color: '#ef4444' },
    { label: 'Investissements', value: total(investments, 'amount'), color: '#3b82f6' }
  ];

  const netWorth = () => incomeExpenseDiff() + investmentDiff();

  const COLORS = ['#22c55e', '#ef4444', '#3b82f6'];

  const investmentEvolution = () => {
    const byMonth = {};
    investments.forEach((inv) => {
      const date = new Date(inv.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const diff = inv.currentValue - inv.amount;
      byMonth[key] = (byMonth[key] || 0) + diff;
    });
    return Object.entries(byMonth).map(([key, value]) => {
      const [year, month] = key.split('-').map(Number);
      return {
        month: new Date(year, month).toLocaleString('default', { month: 'short', year: 'numeric' }),
        gain: value
      };
    });
  };

  const exportCSV = () => {
    const lines = ["Catégorie,Total (€)", ...summary.map(item => `${item.label},${item.value}`)];
    lines.push("\nValeur nette estimée," + netWorth());
    lines.push("Différence Revenus - Dépenses," + incomeExpenseDiff());
    lines.push("Gains/Pertes Investissements," + investmentDiff());

    const csvContent = "data:text/csv;charset=utf-8," + lines.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "dashboard_resume.csv");
    document.body.appendChild(link);
    link.click();
  };

  const exportPDF = () => {
    import("jspdf").then(jsPDF => {
      const doc = new jsPDF.default();
      doc.setFontSize(16);
      doc.text("Rapport Financier - Dashboard", 20, 20);

      let y = 40;
      summary.forEach((item) => {
        doc.text(`${item.label} : ${item.value} €`, 20, y);
        y += 10;
      });

      y += 10;
      doc.text(`Valeur nette estimée : ${netWorth()} €`, 20, y);
      y += 10;
      doc.text(`Différence Revenus - Dépenses : ${incomeExpenseDiff()} €`, 20, y);
      y += 10;
      doc.text(`Gains/Pertes Investissements : ${investmentDiff()} €`, 20, y);

      doc.save("dashboard_resume.pdf");
    });
  };

  return (
    <>
      <Navbar />
      <div className="container my-5">
        <h2 className="fw-bold text-center">📊 Tableau de Bord</h2>

        <div className="text-center mb-4">
          <button className="btn btn-outline-success me-2" onClick={exportCSV}>📂 Export CSV</button>
          <button className="btn btn-outline-danger" onClick={exportPDF}>📄 Export PDF</button>
        </div>

        <div className="row text-center my-4">
          {summary.map((item, idx) => (
            <div key={idx} className="col-md-4">
              <div className="p-4 rounded shadow" style={{ backgroundColor: item.color, color: 'white' }}>
                <h4>{item.label}</h4>
                <h3 className="fw-bold">{item.value}€</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-4 my-4">
          <h5 className="fw-bold text-success">Répartition Globale</h5>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={summary} dataKey="value" nameKey="label" outerRadius={120} label>
                {summary.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4 my-4">
          <h5 className="fw-bold text-primary">📈 Évolution des Revenus & Dépenses</h5>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mergeData(revenues, expenses)}>
              <XAxis dataKey="month" stroke="#333" />
              <YAxis stroke="#333" />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Line type="monotone" dataKey="revenus" stroke="#22c55e" strokeWidth={3} />
              <Line type="monotone" dataKey="dépenses" stroke="#ef4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-4 my-4">
          <h5 className="fw-bold text-dark">💼 Valeur Nette Estimée</h5>
          <div className="text-center display-5 fw-bold text-success">{netWorth()} €</div>
        </div>

        <div className="row text-center my-4">
          <div className="col-md-6">
            <div className="p-4 border rounded shadow-sm">
              <h5 className="fw-bold text-primary">Différence Revenus - Dépenses</h5>
              <h4 className={incomeExpenseDiff() >= 0 ? 'text-success' : 'text-danger'}>{incomeExpenseDiff()} €</h4>
            </div>
          </div>
          <div className="col-md-6">
            <div className="p-4 border rounded shadow-sm">
              <h5 className="fw-bold text-info">Gains/Pertes Investissements</h5>
              <h4 className={investmentDiff() >= 0 ? 'text-success' : 'text-danger'}>{investmentDiff()} €</h4>
            </div>
          </div>
        </div>

        <div className="card p-4 my-4">
          <h5 className="fw-bold text-secondary">📊 Évolution Mensuelle des Investissements</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={investmentEvolution()}>
              <XAxis dataKey="month" stroke="#15803d" />
              <YAxis stroke="#15803d" />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Bar dataKey="gain" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <Footer />
    </>
  );
};

function mergeData(revs, exps) {
  const months = {};

  revs.forEach((r) => {
    const date = new Date(r.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!months[key]) months[key] = { revenus: 0, dépenses: 0 };
    months[key].revenus += r.amount;
  });

  exps.forEach((e) => {
    const date = new Date(e.date);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!months[key]) months[key] = { revenus: 0, dépenses: 0 };
    months[key].dépenses += e.amount;
  });

  return Object.entries(months)
    .map(([key, values]) => {
      const [year, month] = key.split('-').map(Number);
      return {
        month: new Date(year, month).toLocaleString('default', { month: 'short', year: 'numeric' }),
        ...values
      };
    })
    .sort((a, b) => new Date(a.month) - new Date(b.month));
}

export default Dashboard;