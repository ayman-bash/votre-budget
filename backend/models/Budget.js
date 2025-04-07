const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, enum: ['Alimentation', 'Loyer', 'Transport', 'Loisirs', 'Autre'], required: true },
  limit: { type: Number, required: true },
  spent: { type: Number, default: 0 },
  alertThreshold: { type: Number, default: 80 } // Alerte à 80% du budget
});

module.exports = mongoose.model('Budget', budgetSchema);
