import AdminNavbar from '../composants/navComp';
import AdminFooter from '../composants/footerComp';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, XAxis, YAxis, CartesianGrid, Bar } from 'recharts';

const AdminUsers = () => {
    const COLORS = ['#4ade80', '#22c55e'];

const getRoleData = () => {
  const roleCount = { admin: 0, user: 0 };
  users.forEach(user => {
    if (user.role === 'admin') {
      roleCount.admin += 1;
    } else {
      roleCount.user += 1;
    }
  });

  return [
    { name: 'Admins', value: roleCount.admin },
    { name: 'Utilisateurs', value: roleCount.user }
  ];
};

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:5000/admin/users', {
        credentials: 'include'
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error('Erreur récupération utilisateurs:', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    try {
      const res = await fetch(`http://localhost:5000/admin/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await res.json();
      if (res.ok) {
        alert('Utilisateur supprimé avec succès');
        fetchUsers();
      } else {
        alert(data.message || 'Erreur suppression');
      }
    } catch (err) {
      console.error('Erreur suppression utilisateur:', err);
    }
  };

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'user' ? 'admin' : 'user';
    try {
      const res = await fetch(`http://localhost:5000/admin/users/role/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });
      const data = await res.json();
      if (res.ok) {
        alert('Rôle mis à jour');
        fetchUsers();
      } else {
        alert(data.message || 'Erreur mise à jour');
      }
    } catch (err) {
      console.error('Erreur changement rôle:', err);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="container my-5">
        <h1 className="fw-bold text-center text-success mb-5">👥 Gestion des Utilisateurs</h1>

        {loading ? (
          <div className="text-center">Chargement...</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-success">
                <tr>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Date d'inscription</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge ${user.role === 'admin' ? 'bg-success' : 'bg-secondary'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-sm btn-warning me-2" onClick={() => toggleRole(user._id, user.role)}>
                        ✏️ Changer Rôle
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteUser(user._id)}>
                        🗑️ Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="row my-4">
  <div className="col-md-6">
    <div className="card p-4 shadow-sm">
      <h5 className="fw-bold text-center mb-4">📊 Répartition des Rôles</h5>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={getRoleData()}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {getRoleData().map((entry, index) => (
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
      <h5 className="fw-bold text-center mb-4">📈 Comparaison Admins vs Users</h5>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={getRoleData()}>
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
    </>
  );
};

export default AdminUsers;
