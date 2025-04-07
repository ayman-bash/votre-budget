// routes/investment.js
const express = require('express');
const router = express.Router();
const Investment = require('../models/Investment');
const auth = require('../middleware/auth');

// GET - récupérer tous les investissements
router.get('/', auth, async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user.id }).sort({ date: -1 });
    res.json(investments);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des investissements.' });
  }
});

// POST - ajouter un nouvel investissement
router.post('/', auth, async (req, res) => {
  const { type, amount, currentValue, date, notes } = req.body;
  if (!type || !amount || !currentValue || !date) {
    return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
  }

  try {
    const newInvestment = new Investment({
      user: req.user.id,
      type,
      amount,
      currentValue,
      date,
      notes
    });

    await newInvestment.save();
    res.status(201).json(newInvestment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'investissement.' });
  }
});

// PUT - modifier un investissement
router.put('/:id', auth, async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);
    if (!investment) return res.status(404).json({ message: 'Investissement non trouvé.' });
    if (investment.user.toString() !== req.user.id) return res.status(403).json({ message: 'Non autorisé.' });

    Object.assign(investment, req.body);
    await investment.save();
    res.json(investment);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'investissement.' });
  }
});

// DELETE - supprimer un investissement
router.delete('/:id', auth, async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);
    if (!investment) return res.status(404).json({ message: 'Investissement non trouvé.' });
    if (investment.user.toString() !== req.user.id) return res.status(403).json({ message: 'Non autorisé.' });

    await investment.deleteOne();
    res.json({ message: 'Investissement supprimé.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'investissement.' });
  }
});

module.exports = router;
