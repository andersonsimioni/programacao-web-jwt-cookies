const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
    // Em projeto real: usar hash com bcrypt!
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'admin', 'grupo']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
