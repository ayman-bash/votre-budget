const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des dépenses.' });
  }
});

router.post('/', auth, async (req, res) => {
  const { description, amount, category, date, notes } = req.body;
  if (!description || !amount || !category || !date) {
    return res.status(400).json({ message: 'Tous les champs requis ne sont pas remplis.' });
  }

  try {
    const newExpense = new Expense({
      user: req.user.id,
      description,
      amount,
      category,
      date,
      notes
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la dépense.' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Dépense non trouvée.' });

    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé.' });
    }

    Object.assign(expense, req.body);
    await expense.save();
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la dépense.' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) return res.status(404).json({ message: 'Dépense non trouvée.' });

    if (expense.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Non autorisé.' });
    }

    await expense.deleteOne();
    res.json({ message: 'Dépense supprimée.' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la dépense.' });
  }
});

module.exports = router;
