import Navbar from '../composants/nav';
import Footer from '../composants/footer';
import AdminNavbar from '../composants/navComp';
import AdminFooter from '../composants/footerComp';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
    const COLORS = ['#4ade80', '#22c55e', '#16a34a', '#15803d'];

const getChartData = () => [
  { name: 'Utilisateurs', value: stats.users },
  { name: 'Revenus', value: stats.revenues },
  { name: 'Dépenses', value: stats.expenses },
  { name: 'Investissements', value: stats.investments },
];

  const [stats, setStats] = useState({
    users: 0,
    revenues: 0,
    expenses: 0,
    investments: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/admin/stats', {
          credentials: 'include'
        });
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error('Erreur chargement stats:', error);
      }
    };
  
    fetchStats();
  }, []);
  

  return (
    <>
<AdminNavbar />
<div className="container my-5">
        <h1 className="fw-bold text-center text-success mb-5">👑 Panneau d'administration</h1>

        <div className="row g-4">
          <div className="col-md-3">
            <div className="card p-4 text-center shadow-sm admin-card">
              <h5 className="fw-bold text-muted">Utilisateurs</h5>
              <h2 className="text-success">{stats.users}</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card p-4 text-center shadow-sm admin-card">
              <h5 className="fw-bold text-muted">Revenus</h5>
              <h2 className="text-success">{stats.revenues}</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card p-4 text-center shadow-sm admin-card">
              <h5 className="fw-bold text-muted">Dépenses</h5>
              <h2 className="text-success">{stats.expenses}</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="card p-4 text-center shadow-sm admin-card">
              <h5 className="fw-bold text-muted">Investissements</h5>
              <h2 className="text-success">{stats.investments}</h2>
            </div>
          </div>
        </div>

        <div className="mt-5 text-center">
          <p className="lead text-muted">
            Gérer les utilisateurs, suivre les revenus, contrôler les dépenses et surveiller les investissements.
          </p>
          <div className="d-flex flex-wrap justify-content-center gap-3 mt-4">
            <a href="/admin/users" className="btn btn-outline-success btn-lg">👥 Gérer Utilisateurs</a>
            <a href="/admin/revenues" className="btn btn-outline-success btn-lg">💰 Gérer Revenus</a>
            <a href="/admin/expenses" className="btn btn-outline-success btn-lg">🛒 Gérer Dépenses</a>
            <a href="/admin/investments" className="btn btn-outline-success btn-lg">📈 Gérer Investissements</a>
          </div>
        </div>
      </div>
      <div className="row my-5">
  <div className="col-md-6">
    <div className="card p-4 shadow-sm">
      <h5 className="fw-bold text-center mb-4">📊 Répartition Globale</h5>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={getChartData()}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {getChartData().map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>

  <div className="col-md-6">
    <div className="card p-4 shadow-sm">
      <h5 className="fw-bold text-center mb-4">📈 Comparaison Quantitative</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={getChartData()}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#15803d" />
          <YAxis stroke="#15803d" />
          <Tooltip />
          <Bar dataKey="value" fill="#22c55e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
</div>

      <AdminFooter />

      {/* Bonus de Style */}
      <style>{`
        .admin-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          transition: transform 0.3s ease;
        }
        .admin-card:hover {
          transform: translateY(-5px);
        }
      `}</style>
    </>
  );
};

export default AdminDashboard;
