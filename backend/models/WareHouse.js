const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema({
  name: String,
  location: String,
  approved: { type: Boolean, default: false },

  plantHead: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlantHead',
    unique: true
  },
  accountant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Accountant',
    unique: true
  },

  stock: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 0 },
      price: { type: Number, default: 0 },
      lastUpdated: { type: Date, default: Date.now }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Warehouse', warehouseSchema);
