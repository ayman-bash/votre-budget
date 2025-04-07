import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Footer from '../composants/footer';
import Navbar from '../composants/nav';
const data = [
  { month: 'Jan', revenus: 1200, dépenses: 800 },
  { month: 'Fév', revenus: 1800, dépenses: 1300 },
  { month: 'Mar', revenus: 2000, dépenses: 1700 },
  { month: 'Avr', revenus: 2200, dépenses: 1400 },
  { month: 'Mai', revenus: 2500, dépenses: 1900 },
  { month: 'Juin', revenus: 2700, dépenses: 2100 },
];

const Home = () => {
  return (
    <>
      <Navbar />

      <div className="home-hero d-flex flex-column align-items-center justify-content-center text-white text-center">
        <h1 className="display-3 fw-bold animate-text">
          Maîtrisez votre <span className="text-highlight">budget</span>
        </h1>
        <p className="lead fs-4 mb-4">
          Optimisez vos finances et atteignez vos objectifs plus rapidement.
        </p>
        <a href="/auth" className="btn btn-light btn-lg fw-semibold px-5 py-3 shadow">
          Commencer maintenant 🚀
        </a>
      </div>

      <div className="container my-5">
        <h2 className="text-center fw-bold mb-4">📊 Suivi de votre évolution financière</h2>
        <div className="chart-container p-5">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={data}>
              <XAxis dataKey="month" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
              <Line type="monotone" dataKey="revenus" stroke="#22c55e" strokeWidth={4} />
              <Line type="monotone" dataKey="dépenses" stroke="#ef4444" strokeWidth={4} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="container my-5">
  <h2 className="fw-bold text-center mb-4">🚀 Pourquoi choisir <span className="text-success">BudgetBuddy</span> ?</h2>
  <p className="lead text-muted text-center mb-5">
    Découvrez comment BudgetBuddy vous aide à mieux gérer vos finances et à atteindre vos objectifs financiers plus rapidement.
  </p>

  <div className="row g-4">
    <div className="col-md-4">
      <div className="feature-box p-4 text-center">
        <h2>📊</h2>
        <h5 className="fw-bold text-dark">Analyse Financière Avancée</h5>
        <p className="text-muted">
          Visualisez vos revenus et dépenses en temps réel avec des graphiques interactifs et des rapports détaillés.
        </p>
      </div>
    </div>

    <div className="col-md-4">
      <div className="feature-box p-4 text-center">
        <h2>🔔</h2>
        <h5 className="fw-bold text-dark">Alertes Budgétaires</h5>
        <p className="text-muted">
          Recevez des notifications lorsque vous approchez ou dépassez votre budget mensuel pour éviter les mauvaises surprises.
        </p>
      </div>
    </div>

    <div className="col-md-4">
      <div className="feature-box p-4 text-center">
        <h2>🔒</h2>
        <h5 className="fw-bold text-dark">Sécurité Maximale</h5>
        <p className="text-muted">
          Vos données sont chiffrées avec les dernières technologies pour garantir votre confidentialité et sécurité.
        </p>
      </div>
    </div>

    {/* Avantage 4 */}
    <div className="col-md-4">
      <div className="feature-box p-4 text-center">
        <h2>📅</h2>
        <h5 className="fw-bold text-dark">Planification Budgétaire</h5>
        <p className="text-muted">
          Définissez des objectifs d'épargne et suivez leur progression grâce à des outils simples et intuitifs.
        </p>
      </div>
    </div>

    {/* Avantage 5 */}
    <div className="col-md-4">
      <div className="feature-box p-4 text-center">
        <h2>📈</h2>
        <h5 className="fw-bold text-dark">Suivi des Investissements</h5>
        <p className="text-muted">
          Suivez la performance de vos investissements et optimisez votre patrimoine en temps réel.
        </p>
      </div>
    </div>

    {/* Avantage 6 */}
    <div className="col-md-4">
      <div className="feature-box p-4 text-center">
        <h2>🤝</h2>
        <h5 className="fw-bold text-dark">Assistance Personnalisée</h5>
        <p className="text-muted">
          Profitez d'un support client 24/7 pour vous accompagner dans votre gestion financière.
        </p>
      </div>
    </div>
  </div>
</div>
<div className="container my-5">
  <h2 className="fw-bold text-center mb-4">💬 Ce que disent nos utilisateurs</h2>
  <p className="lead text-muted text-center mb-5">
    Découvrez pourquoi des milliers d'utilisateurs nous font confiance pour gérer leurs finances.
  </p>

  <div className="row g-4">
    {/* Témoignage 1 */}
    <div className="col-md-4">
      <div className="testimonial-box p-4 text-center">
        <p className="fst-italic">"BudgetBuddy m'a aidé à économiser plus de 30% de mes revenus chaque mois !"</p>
        <h5 className="fw-bold mt-3">- Sophie M.</h5>
      </div>
    </div>

    {/* Témoignage 2 */}
    <div className="col-md-4">
      <div className="testimonial-box p-4 text-center">
        <p className="fst-italic">"L'analyse financière est ultra-pratique. J'ai enfin une vision claire de mes dépenses !"</p>
        <h5 className="fw-bold mt-3">- Julien T.</h5>
      </div>
    </div>

    {/* Témoignage 3 */}
    <div className="col-md-4">
      <div className="testimonial-box p-4 text-center">
        <p className="fst-italic">"Grâce aux alertes budgétaires, je ne dépasse plus mon budget et je peux investir sereinement."</p>
        <h5 className="fw-bold mt-3">- Laura D.</h5>
      </div>
    </div>
  </div>
</div>
<Footer/>

      <style>{`
        .home-hero {
          min-height: 100vh;
          background: linear-gradient(135deg, #22c55e, #15803d);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px;
        }

        .text-highlight {
          background: linear-gradient(to right, #ffdd57, #ff914d);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .card-glass {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(20px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    color: white;
    transition: transform 0.3s ease-in-out;
  }

  .card-glass:hover {
    transform: scale(1.05);
  }

        .chart-container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(15px);
          padding: 30px;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .feature-box {
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
    color: white;
  }

  .feature-box h2 {
    font-size: 3rem;
  }

  .feature-box p {
    font-size: 1rem;
    margin-top: 10px;
  }

  .feature-box:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.2);
  }
     .testimonial-box {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 25px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
    color: black;
  }

  .testimonial-box:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.9);
  }

  .testimonial-box p {
    font-size: 1rem;
    font-style: italic;
    color: #555;
  }

  .testimonial-box h5 {
    font-size: 1.2rem;
    color: #15803d;
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
    </>
  );
};

export default Home;
