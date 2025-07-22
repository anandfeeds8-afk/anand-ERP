const mongoose = require('mongoose');
const plantHeadSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  warehouse: { type: mongoose.Schema.Types.ObjectId, ref: 'Warehouse', unique: true }, // One-to-one
}, { timestamps: true });

module.exports = mongoose.model('PlantHead', plantHeadSchema);
  