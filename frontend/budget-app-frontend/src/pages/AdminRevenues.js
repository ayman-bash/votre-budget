import { useState, useEffect } from 'react';
import AdminNavbar from '../composants/navComp';
import AdminFooter from '../composants/footerComp';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, XAxis, YAxis, CartesianGrid, Bar } from 'recharts';

const AdminRevenues = () => {
  const [revenues, setRevenues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRevenues();
  }, []);

  const fetchRevenues = async () => {
    try {
      const res = await fetch('http://localhost:5000/admin/revenues', {
        credentials: 'include'
      });
      const data = await res.json();
      setRevenues(data);
    } catch (err) {
      console.error('Erreur chargement revenues:', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#4ade80', '#22c55e', '#16a34a', '#15803d', '#4c1d95', '#9333ea'];

  const getRevenueCategoryData = () => {
    const categoryCount = {};
    revenues.forEach(rev => {
      if (rev.category) {
        categoryCount[rev.category] = (categoryCount[rev.category] || 0) + 1;
      }
    });

    return Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
  };

  return (
    <>
      <AdminNavbar />
      <div className="container my-5">
        <h1 className="fw-bold text-center text-success mb-5">💰 Gestion des Revenus</h1>

        {loading ? (
          <div className="text-center">Chargement...</div>
        ) : (
          <>
            {/* Graphiques */}
            <div className="row my-4">
              <div className="col-md-6">
                <div className="card p-4 shadow-sm">
                  <h5 className="fw-bold text-center mb-4">📊 Répartition par Catégorie</h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getRevenueCategoryData()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {getRevenueCategoryData().map((entry, index) => (
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
                  <h5 className="fw-bold text-center mb-4">📈 Nombre de Revenus par Catégorie</h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getRevenueCategoryData()}>
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

            {/* Tableau */}
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-success">
                  <tr>
                    <th>Source</th>
                    <th>Montant (€)</th>
                    <th>Catégorie</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {revenues.map(rev => (
                    <tr key={rev._id}>
                      <td>{rev.source}</td>
                      <td>{rev.amount} €</td>
                      <td>
                        <span className="badge bg-secondary">{rev.category || 'Non catégorisé'}</span>
                      </td>
                      <td>{new Date(rev.date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
      <AdminFooter />
    </>
  );
};

export default AdminRevenues;
