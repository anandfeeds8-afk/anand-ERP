const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET = process.env.JWT_SECRET;
const Accountant = require("../models/Accountant");
// Login Accountant
const loginAccountant = async (req, res) => {
  const { email, password } = req.body;
  try {
    const accountant = await Accountant.findOne({ email });
    if (!accountant) return res.status(404).json({ success: false, message: 'No accountant found' });

    const isMatch = await bcrypt.compare(password, accountant.password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Incorrect password' });

    const token = jwt.sign({ accountantId: accountant._id }, SECRET, { expiresIn: '1d' });

    res.status(200).json({ success: true, token, data: accountant });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// Get dispatched orders
const getDispatchedOrders = async (req, res) => {};

// Generate Invoice
const generateInvoice = async (req, res) => {};

// Get Invoice by Order ID
const getInvoiceDetails = async (req, res) => {};

module.exports = {
  loginAccountant,
  getDispatchedOrders,
  generateInvoice,
  getInvoiceDetails
};
