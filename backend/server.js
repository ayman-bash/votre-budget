const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const cookieParser = require('cookie-parser');
const Revenue = require('./models/Revenue');
const Expense = require('./models/Expense');
const Investment = require('./models/Investment');
const Budget = require('./models/Budget');
const app = express();

app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true 
}));app.use(express.json());
app.use(express.urlencoded())
app.use(cookieParser());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);

mongoose.connect(config.MONGODB_URI)
  .then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Erreur de connexion MongoDB:', err));

app.use('/user/', require('./routes/auth'));
app.use('/revenues', require('./routes/revenue'));
app.use('/expenses', require('./routes/expense'));
app.use('/investments', require('./routes/investment'));
app.use('/admin', require('./routes/admin'));

const PORT = config.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));