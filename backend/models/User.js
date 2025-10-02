const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, index: true, required: true, trim: true },
  email: { type: String, unique: true, sparse: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin','editor','viewer'], default: 'admin', index: true },
  isActive: { type: Boolean, default: true },
  lastLoginAt: Date
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
