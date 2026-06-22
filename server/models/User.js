const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
}, { _id: false });

const AvailabilitySchema = new mongoose.Schema({
  day: { type: String, enum: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'] },
  from: String, // "14:00"
  to: String,   // "16:00"
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false },
  googleId: String,
  avatar: String,
  university: String,
  program: String,
  bio: String,
  teach: [SkillSchema],
  learn: [SkillSchema],
  availability: [AvailabilitySchema],
  ratingAvg: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  online: { type: Boolean, default: false },
  lastSeen: Date,
  resetToken: String,
  resetTokenExp: Date,
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
