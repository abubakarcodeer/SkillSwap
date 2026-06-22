const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
  host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // teaches
  guest: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // learns
  skill: { type: String, required: true },
  startsAt: { type: Date, required: true },
  durationMin: { type: Number, default: 60 },
  status: { type: String, enum: ['pending','accepted','rejected','completed','cancelled'], default: 'pending' },
  notes: String,
  meetingLink: String,
}, { timestamps: true });

module.exports = mongoose.model('Session', SessionSchema);
