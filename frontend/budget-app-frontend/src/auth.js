import { useState } from 'react';
import { FaGoogle, FaFacebook, FaGithub } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const url = isLogin
        ? 'http://localhost:5000/user/login' 
        : 'http://localhost:5000/user/register'; 
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }
  
      console.log('Réponse du serveur :', data);
      alert(isLogin ? 'Connexion réussie !' : 'Inscription réussie !');
  
      if (isLogin) {
        // Après login, récupérer qui est connecté
        const resUser = await fetch('http://localhost:5000/user/check-auth', {
          credentials: 'include'
        });
        const userData = await resUser.json();
  
        if (userData.role === 'admin') {
          navigate('/admin'); // Redirige vers admin
        } else {
          navigate('/dashboard'); // Redirige vers dashboard normal
        }
      } else {
        navigate('/auth'); // Après inscription, rester sur auth pour se connecter
      }
  
    } catch (err) {
      setError(err.message);
      console.error('Erreur :', err);
    } finally {
      setLoading(false);
    }
  };
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-vh-100 d-flex justify-content-center align-items-center p-4 auth-gradient">
      <div className="container max-w-md bg-white bg-opacity-90 backdrop-blur rounded-3xl shadow-lg p-5 border border-white border-opacity-20">
        <div className="position-relative mb-4">
          <div className="d-flex">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-fill btn btn-link text-decoration-none fs-5 fw-bold py-3 ${
                isLogin ? 'text-success' : 'text-muted'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-fill btn btn-link text-decoration-none fs-5 fw-bold py-3 ${
                !isLogin ? 'text-success' : 'text-muted'
              }`}
            >
              Signup
            </button>
          </div>
          <div
            className={`position-absolute bottom-0 bg-success transition-all duration-300`}
            style={{
              height: '2px',
              width: isLogin ? '50%' : '50%',
              left: isLogin ? '0' : '50%'
            }}
          />
        </div>
  
        <form onSubmit={handleSubmit} className="gap-3 d-flex flex-column">
          {!isLogin && (
            <div className="form-group">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="form-control form-control-lg border-secondary focus-green"
                placeholder="Username"
              />
            </div>
          )}
  
          <div className="form-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-control form-control-lg border-secondary focus-green"
              placeholder="Email"
            />
          </div>
  
          <div className="form-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-control form-control-lg border-secondary focus-green"
              placeholder="Password"
            />
          </div>
  
          {error && <div className="text-danger small text-center">{error}</div>}
  
          <button
            type="submit"
            disabled={loading}
            className="btn btn-success btn-lg w-100 fw-semibold"
          >
            {loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'Créer un compte'}
          </button>
        </form>
  
        <div className="mt-4">
          <div className="position-relative my-4">
            <div className="border-top"></div>
            <div className="position-absolute top-50 start-50 translate-middle bg-white px-2">
              <span className="text-muted small">Ou continuer avec</span>
            </div>
          </div>
  
          <div className="row g-3">
            <div className="col-4">
              <button className="btn btn-outline-secondary w-100 d-flex justify-content-center align-items-center p-3">
                <FaGoogle className="text-muted fs-5" />
              </button>
            </div>
            <div className="col-4">
              <button className="btn btn-outline-secondary w-100 d-flex justify-content-center align-items-center p-3">
                <FaFacebook className="text-muted fs-5" />
              </button>
            </div>
            <div className="col-4">
              <button className="btn btn-outline-secondary w-100 d-flex justify-content-center align-items-center p-3">
                <FaGithub className="text-muted fs-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
  
      <style>{`
        .auth-gradient {
          background: linear-gradient(135deg, #22c55e 0%, #15803d 100%);
        }
        .max-w-md {
          max-width: 28rem;
        }
        .backdrop-blur {
          backdrop-filter: blur(10px);
        }
        .focus-green:focus {
          border-color: #22c55e;
          box-shadow: 0 0 0 0.2rem rgba(34, 197, 94, 0.25);
        }
      `}</style>
    </div>
  );
};

export default AuthForm;