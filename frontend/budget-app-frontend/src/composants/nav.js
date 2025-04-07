import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:5000/user/check-auth', {
          credentials: 'include',
        });
        const data = await response.json();
        setIsAuthenticated(data.isAuthenticated);
      } catch (error) {
        console.error('Erreur de vérification du token:', error);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/user/logout', {}, { withCredentials: true });
      navigate('/auth');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark px-4 py-3 green-navbar shadow-sm sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold fs-3 text-white" to="/">💰 BudgetBuddy</Link>

        <ul className="navbar-nav ms-auto d-flex flex-row gap-3 align-items-center">
          <li className="nav-item">
            <Link className="nav-link nav-link-white" to="/">Accueil</Link>
          </li>
          {isAuthenticated && (
            <li className="nav-item">
              <Link className="nav-link nav-link-white fw-bold" to="/dashboard">Dashboard</Link>
            </li>
          )}
          <li className="nav-item">
            <Link className="nav-link nav-link-white" to="/revenues">Revenus</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link nav-link-white" to="/expenses">Dépenses</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link nav-link-white" to="/investments">Investissements</Link>
          </li>
         
          {!isAuthenticated ? (
            <li className="nav-item">
              <Link className="btn btn-light fw-semibold px-4 py-2 rounded-pill shadow-sm" to="/auth">
                Connexion
              </Link>
            </li>
          ) : (
            <li className="nav-item">
              <button className="btn btn-outline-light fw-semibold px-4 py-2 rounded-pill shadow-sm" onClick={handleLogout}>
                Se déconnecter
              </button>
            </li>
          )}
        </ul>
      </div>

      <style>{`
        .green-navbar {
          background: linear-gradient(135deg, #22c55e 0%, #15803d 100%);
          backdrop-filter: blur(10px);
          border-bottom: 2px solid rgba(255, 255, 255, 0.1);
        }

        .nav-link-white {
          color: #ffffff;
          font-weight: 500;
          position: relative;
          transition: color 0.3s ease;
        }

        .nav-link-white::after {
          content: '';
          position: absolute;
          width: 0%;
          height: 2px;
          left: 0;
          bottom: -5px;
          background-color: white;
          transition: width 0.3s ease;
        }

        .nav-link-white:hover::after {
          width: 100%;
        }

        .nav-link-white:hover {
          color: #e2e8f0;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
