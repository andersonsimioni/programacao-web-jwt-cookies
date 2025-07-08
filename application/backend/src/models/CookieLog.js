const mongoose = require('mongoose');

const cookieSchema = new mongoose.Schema({
  name: String,
  value: String,
  httpOnly: Boolean,
  secure: Boolean,
  sameSite: String,
  path: String,
  expires: Date
}, { _id: false });

const cookieLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now
  },
  ip: String,
  userAgent: String,
  cookies: [cookieSchema],
  decodedJWT: {
    userId: String,
    role: String,
    iat: Number,
    exp: Number
  }
});

module.exports = mongoose.model('CookieLog', cookieLogSchema);
