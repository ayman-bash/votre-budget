const mongoose = require('mongoose');

const revenueSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  source: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, enum: ['Salaire', 'Business', 'Investissement', 'Autre'], required: true },
  date: { type: Date, required: true },
  notes: { type: String }
});

module.exports = mongoose.model('Revenue', revenueSchema);
