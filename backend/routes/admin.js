const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Revenue = require('../models/Revenue');
const Expense = require('../models/Expense');
const Investment = require('../models/Investment');
const auth = require('../middleware/auth');

router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé' });
    }

    const usersCount = await User.countDocuments();
    const revenuesCount = await Revenue.countDocuments();
    const expensesCount = await Expense.countDocuments();
    const investmentsCount = await Investment.countDocuments();

    res.json({
      users: usersCount,
      revenues: revenuesCount,
      expenses: expensesCount,
      investments: investmentsCount,
    });
  } catch (error) {
    console.error('Erreur chargement stats admin:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});


router.get('/users', auth, async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur récupération utilisateurs' });
  }
});

// Supprimer un utilisateur
router.delete('/users/:id', auth, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur suppression' });
  }
});

// Changer le rôle d'un utilisateur
router.put('/users/role/:id', auth, async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erreur changement rôle' });
  }
});
router.get('/revenues', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé' });
      }
  
      const revenues = await Revenue.find().sort({ date: -1 });
      res.json(revenues);
    } catch (error) {
      console.error('Erreur récupération revenues:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

  // ⚡ Retourner toutes les dépenses
  router.get('/expenses', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé' });
      }
  
      const expenses = await Expense.find().sort({ date: -1 });
      res.json(expenses);
    } catch (error) {
      console.error('Erreur récupération dépenses:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  router.get('/investments', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Accès refusé' });
      }
  
      const investments = await Investment.find().sort({ date: -1 });
      res.json(investments);
    } catch (error) {
      console.error('Erreur récupération investissements:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
module.exports = router;
