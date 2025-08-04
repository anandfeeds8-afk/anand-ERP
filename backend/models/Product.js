const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: String,
  category: String,
  description: String,
  price: {
      type: Number,
      default: 0,
      min: 0
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
