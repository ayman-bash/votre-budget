const jwt = require('jsonwebtoken');
const config = require('../config');

const auth = (req, res, next) => {
  const token = req.cookies.token; // Récupération du token depuis les cookies

  if (!token) {
    return res.status(401).json({ isAuthenticated: false, message: 'Aucun token, accès refusé' });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded; // Stocke les données du user pour les prochaines requêtes
    next();
  } catch (err) {
    return res.status(401).json({ isAuthenticated: false, message: 'Token invalide' });
  }
};

module.exports = auth;
