const mongoose = require('mongoose');
const SalesAuthorizerSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String
}, { timestamps: true });

module.exports = mongoose.model('SalesAuthorizer', SalesAuthorizerSchema);
