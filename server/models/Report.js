const mongoose = require('mongoose');

module.exports = mongoose.model('Report', new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  target: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: String,
  resolved: { type: Boolean, default: false },
}, { timestamps: true }));
