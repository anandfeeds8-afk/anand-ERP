const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  rate: Number,
  unit: String // e.g., KG, Bag, Ton
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
