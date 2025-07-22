const Salesman = require('../models/Salesman');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_TOKEN = process.env.JWT_SECRET;


const SalesManager = require('../models/SalesManager');

// Login Controller
const loginSalesManager = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await SalesManager.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'Not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid password' });

    const token = jwt.sign({ salesManagerId: user._id }, SECRET_TOKEN, { expiresIn: '1d' });
    res.status(200).json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// View assigned but unforwarded orders
const getAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ orderStatus: 'Placed' })
      .populate('party', 'name contact')
      .populate('placedBy', 'name email phone');

    res.status(200).json({
      success: true,
      message: "Fetched all orders with status 'Placed'",
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while fetching assigned orders",
      error: error.message
    });
  }
};


const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId)
      .populate('party', 'name contact')
      .populate('placedBy', 'name email phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Order details fetched successfully",
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching order details",
      error: error.message
    });
  }
};
// Forward order to Authorizer
const forwardOrderToAuthorizer = async (req, res) => {
  const { orderId } = req.params;
  const salesManagerId = req.user.salesManagerId; // from verifySalesmanager middleware

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.orderStatus !== 'Placed') {
      return res.status(400).json({
        success: false,
        message: "Order is not in 'Placed' status"
      });
    }

    // ✅ Update to correct status and assign manager
    order.orderStatus = 'ForwardedToAuthorizer';
    order.forwardedByManager = salesManagerId;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order forwarded to Authorizer successfully",
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error forwarding order to Authorizer",
      error: error.message
    });
  }
};



// Forward order to Sales Authorizer
const forwardOrderToSalesAuthorizer = async (req, res) => {
  const { orderId } = req.params;
  const salesManagerId = req.user.salesManagerId; // from verifySalesmanager middleware

  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (order.orderStatus !== 'ForwardedToAuthorizer') {
      return res.status(400).json({
        success: false,
        message: "Order is not in 'ForwardedToAuthorizer' status"
      });
    }

    // ✅ Update to correct status and assign manager
    order.orderStatus = 'ForwardedToSalesAuthorizer';
    order.forwardedBySalesAuthorizer = salesManagerId;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order forwarded to Sales Authorizer successfully",
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error forwarding order to Sales Authorizer",
      error: error.message
    });
  }
}



// Get all forwarded orders
const getForwardedOrders = async (req, res) => {}


module.exports = {
  loginSalesManager,
  getAssignedOrders,
  forwardOrderToAuthorizer,
  getForwardedOrders,
  getOrderDetails
};