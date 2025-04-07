import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('');

  useEffect(() => {
    // Ici tu peux appeler ton backend pour afficher le nom de l'admin si tu veux
    const fetchAdmin = async () => {
      try {
        const res = await fetch('http://localhost:5000/user/check-auth', { credentials: 'include' });
        const data = await res.json();
        if (data.role === 'admin') {
          setAdminName(data.username || 'Admin');
        } else {
          navigate('/auth'); // Protection au cas où un user normal arrive ici
        }
      } catch (err) {
        console.error(err);
        navigate('/auth');
      }
    };

    fetchAdmin();
  }, [navigate]);

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/;'; // Efface le token cookie
    navigate('/auth');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark p-3 sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-3" to="/admin">👑 Admin Panel</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="adminNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/users">👥 Utilisateurs</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/revenues">💰 Revenus</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/expenses">🛒 Dépenses</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/investments">📈 Investissements</Link>
            </li>
          </ul>

          <div className="d-flex align-items-center">
            <span className="text-light me-3 fw-semibold">Bienvenue, {adminName}</span>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
