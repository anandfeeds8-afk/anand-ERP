const mongoose = require('mongoose');
const SalesManagerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String
}, { timestamps: true });

module.exports = mongoose.model('SalesManager', SalesManagerSchema);
