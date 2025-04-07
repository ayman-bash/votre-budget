const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Bourse', 'Crypto', 'Immobilier', 'Autre'], required: true },
  amount: { type: Number, required: true },
  currentValue: { type: Number, required: true },
  date: { type: Date, required: true },
  notes: { type: String }
});

module.exports = mongoose.model('Investment', investmentSchema);
