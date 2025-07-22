const mongoose = require('mongoose');
const SalesmanSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  assignedParties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Party' }],
  collectedPayments: [{
    order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    amount: Number,
    paymentMode: String,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Salesman', SalesmanSchema);
