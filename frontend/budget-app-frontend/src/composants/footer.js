import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const Footer = () => {

  return (
    <footer className="footer text-white text-center p-4">
  <div className="container">
    <div className="row">
      <div className="col-md-4">
        <h4 className="fw-bold">💰 BudgetBuddy</h4>
        <p className="text-light small">
          Prenez le contrôle de vos finances avec un outil simple et puissant.
        </p>
      </div>

      <div className="col-md-4">
        <h5 className="fw-bold">Informations Légales</h5>
        <ul className="list-unstyled">
          <li className="footer-title">📜 Politique de remboursement</li>
          <li className="footer-title">📄 Conditions d'utilisation</li>
          <li className="footer-title">🔒 Politique de confidentialité</li>
        </ul>
      </div>

      <div className="col-md-4">
        <h5 className="fw-bold">Suivez-nous</h5>
        <div className="d-flex justify-content-center gap-3">
          <a href="#" className="social-icon"><i className="fab fa-facebook"></i></a>
          <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
          <a href="#" className="social-icon"><i className="fab fa-linkedin"></i></a>
        </div>
      </div>
    </div>

    <div className="mt-4">
      <p className="small text-light">© 2024 BudgetBuddy - Tous droits réservés.</p>
    </div>
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
           .footer {
    background: linear-gradient(135deg, #15803d, #0c4a2f);
  }

  .footer-title {
    font-size: 1rem;
    font-weight: bold;
    color: #a3e635;
    margin-top: 5px;
  }

   .social-icon {
    font-size: 1.8rem;
    text-decoration: none;
    color: #a3e635;
    transition: color 0.3s ease, transform 0.3s ease;
  }

  .social-icon:hover {
    color: white;
    transform: scale(1.2);
  }
      `}</style>
</footer>
  );
};

export default Footer;
