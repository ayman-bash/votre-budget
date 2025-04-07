import { useState, useEffect } from 'react';
import AdminNavbar from '../composants/navComp';
import AdminFooter from '../composants/footerComp';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, XAxis, YAxis, CartesianGrid, Bar } from 'recharts';

const AdminExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch('http://localhost:5000/admin/expenses', {
        credentials: 'include'
      });
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error('Erreur chargement dépenses:', err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#f87171', '#fb923c', '#facc15', '#4ade80', '#60a5fa', '#c084fc'];

  const getExpenseCategoryData = () => {
    const categoryCount = {};
    expenses.forEach(exp => {
      if (exp.category) {
        categoryCount[exp.category] = (categoryCount[exp.category] || 0) + 1;
      }
    });

    return Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
  };

  return (
    <>
      <AdminNavbar />
      <div className="container my-5">
        <h1 className="fw-bold text-center text-danger mb-5">🛒 Gestion des Dépenses</h1>

        {loading ? (
          <div className="text-center">Chargement...</div>
        ) : (
          <>
            {/* Graphiques */}
            <div className="row my-4">
              <div className="col-md-6">
                <div className="card p-4 shadow-sm">
                  <h5 className="fw-bold text-center mb-4">📊 Répartition des Dépenses par Catégorie</h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={getExpenseCategoryData()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {getExpenseCategoryData().map((entry, index) => (
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
                  <h5 className="fw-bold text-center mb-4">📈 Nombre de Dépenses par Catégorie</h5>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getExpenseCategoryData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" stroke="#b91c1c" />
                      <YAxis stroke="#b91c1c" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#f87171" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Tableau */}
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-danger">
                  <tr>
                    <th>Description</th>
                    <th>Montant (€)</th>
                    <th>Catégorie</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map(exp => (
                    <tr key={exp._id}>
                      <td>{exp.description}</td>
                      <td>{exp.amount} €</td>
                      <td>
                        <span className="badge bg-secondary">{exp.category || 'Non catégorisé'}</span>
                      </td>
                      <td>{new Date(exp.date).toLocaleDateString()}</td>
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

export default AdminExpenses;
