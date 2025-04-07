const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const config = require('../config');
const auth = require('../middleware/auth');
router.post('/register', async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) return res.status(400).json(errors);

  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) return res.status(400).json({ email: 'Email déjà utilisé' });

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    });

    const user = await newUser.save();
    const token = generateToken(user);
    res.json({ token });
    
  } catch (err) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

router.get('/check-auth', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ isAuthenticated: true, role: user.role });
  } catch (err) {
    res.status(500).json({ isAuthenticated: false, message: 'Erreur serveur' });
  }
});


router.post('/login', async (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) return res.status(400).json(errors);

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ email: 'Utilisateur non trouvé' });

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) return res.status(400).json({ password: 'Mot de passe incorrect' });

    const token = generateToken(user);
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 3600000 
    });

    res.json({ 
      success: true,
      message: 'Connexion réussie',
      user: {
        id: user._id,
        email: user.email
      }
    });

  } catch (err) {
    console.error('Erreur login:', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});
router.post('/logout', (req, res) => {
  res.clearCookie('token'); 
  res.status(200).json({ message: 'Déconnexion réussie.' });
});

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email },
    config.JWT_SECRET,
    { expiresIn: '1h' }
  );
};


module.exports = router;