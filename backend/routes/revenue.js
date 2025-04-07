const express = require('express');
const router = express.Router();
const Revenue = require('../models/Revenue');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const revenues = await Revenue.find({ user: req.user.id }).sort({ date: -1 });
    res.json(revenues);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des revenus.' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { source, amount, category, date, notes } = req.body;

    if (!source || !amount || !category || !date) {
      return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
    }

    const newRevenue = new Revenue({
      user: req.user.id,
      source,
      amount,
      category,
      date,
      notes
    });

    await newRevenue.save();
    res.status(201).json(newRevenue);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout du revenu.' });
  }
});

router.delete('/:id', auth, async (req, res) => {
    const revenue = await Revenue.findById(req.params.id);
    if (!revenue) return res.status(404).json({ message: 'Revenu non trouvé.' });
    if (revenue.user.toString() !== req.user.id)
      return res.status(403).json({ message: 'Non autorisé.' });
  
    await Revenue.findByIdAndDelete(req.params.id);
    res.json({ message: 'Revenu supprimé avec succès.' });
  });
  
router.put('/:id', auth, async (req, res) => {
    try {
      const { source, amount, category, date, notes } = req.body;
  
      if (!source || !amount || !category || !date) {
        return res.status(400).json({ message: 'Tous les champs obligatoires doivent être remplis.' });
      }
  
      const revenue = await Revenue.findById(req.params.id);
      if (!revenue) return res.status(404).json({ message: 'Revenu non trouvé.' });
      if (revenue.user.toString() !== req.user.id) return res.status(403).json({ message: 'Non autorisé.' });
  
      revenue.source = source;
      revenue.amount = amount;
      revenue.category = category;
      revenue.date = date;
      revenue.notes = notes;
  
      await revenue.save();
      res.json({ message: 'Revenu mis à jour avec succès.', revenue });
    } catch (error) {
      console.error('Erreur update revenu:', error);
      res.status(500).json({ message: 'Erreur serveur lors de la mise à jour.' });
    }
  });
  
  
module.exports = router;
