const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
