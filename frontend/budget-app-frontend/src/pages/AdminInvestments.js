import { useState, useEffect } from 'react';
import AdminNavbar from '../composants/navComp'; 
import AdminFooter from '../composants/footerComp';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, XAxis, YAxis, CartesianGrid, Bar } from 'recharts';

const AdminInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    try {
      const res = await fetch('http://localhost:5000/admin/investments', {
        credentials: 'include'
      });
      const data = await res.json();
      setInvestments(data);
    } catch (err) {
      console.error('Erreur chargement investissements:', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#60a5fa', '#c084fc', '#4ade80', '#facc15', '#fb923c'];

  const getInvestmentTypeData = () => {
    const typeCount = {};
    investments.forEach(inv => {
      if (inv.type) {
        typeCount[inv.type] = (typeCount[inv.type] || 0) + 1;
      }
    });

    return Object.entries(typeCount).map(([name, value]) => ({ name, value }));
  };

  return (
    <>
      <AdminNavbar />
      <div className="container my-5">
        <h1 className="fw-bold text-center text-primary mb-5">📈 Gestion des Investissements</h1>

        {loading ? (
          <div className="text-center">Chargement...</div>
        ) : (
          <>
            {/* Graphiques */}
            <div className="row my-4">
              <div className="col-md-6">
                <div className="card p-4 shadow-sm">
                  <h5 className="fw-bold text-center mb-4">📊 Répartition par Type d'Investissement</h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getInvestmentTypeData()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {getInvestmentTypeData().map((entry, index) => (
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
                  <h5 className="fw-bold text-center mb-4">📈 Nombre d'Investissements par Type</h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getInvestmentTypeData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" stroke="#2563eb" />
                      <YAxis stroke="#2563eb" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#60a5fa" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Tableau */}
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-primary">
                  <tr>
                    <th>Type</th>
                    <th>Montant Investi (€)</th>
                    <th>Valeur Actuelle (€)</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map(inv => (
                    <tr key={inv._id}>
                      <td>{inv.type}</td>
                      <td>{inv.amount} €</td>
                      <td>{inv.currentValue} €</td>
                      <td>{new Date(inv.date).toLocaleDateString()}</td>
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

export default AdminInvestments;
