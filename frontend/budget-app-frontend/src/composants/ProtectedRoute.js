import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProtectedRoute = () => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // 🔥 On ajoute ça

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('http://localhost:5000/user/check-auth', {
          credentials: 'include',
        });

        const data = await res.json();
        setIsAuthenticated(data.isAuthenticated);
        setIsAdmin(data.role === 'admin'); // 🔥 Vérifie le rôle ici
      } catch (err) {
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div className="text-center p-5">Chargement...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />; // 🔥 Redirige admin vers l'interface admin
  }

  return <Outlet />; // 🔥 Sinon continue la navigation normale
};

export default ProtectedRoute;
