const orderModel = require("../models/Order");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const PlantHead = require('../models/PlantHead');
const Warehouse = require('../models/Warehouse');
const SECRET_TOKEN = process.env.JWT_SECRET;

// PlantHead Login
const loginPlantHead = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await PlantHead.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'Not Found' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ success: false, message: 'Invalid Password' });
 
    const token = jwt.sign({ plantHeadId: user._id }, SECRET_TOKEN, { expiresIn: '1d' });
    res.status(200).json({ success: true, token, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Daily Production Entry (Update stock)
const updateStock = async (req, res) => {};

// View Production Chart (stock overview)
const getProductionChart = async (req, res) => {};

// Dispatch Order
const dispatchOrder = async (req, res) => {};

// Upload Vehicle Info & Photo
const uploadTransportInfo = async (req, res) => {};


// Get all dispatched orders
const getDispatchedOrders = async (req, res) => {};


module.exports = {
  loginPlantHead,
  updateStock,
  getProductionChart,
  dispatchOrder,
  uploadTransportInfo,
  getDispatchedOrders
};