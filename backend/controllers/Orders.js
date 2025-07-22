const orderModel = require("../models/Order");

// Create Order
const createOrder = async (req, res) => {
  try {
    const {
      productType, item, quantity,
      totalAmount, advanceAmount,
      dueDate, paymentMode, notes, party
    } = req.body;

    const placedBy = req.userId; // assumed from middleware (Salesman login)
    const dueAmount = totalAmount - (advanceAmount || 0);

    const newOrder = await orderModel.create({
      productType,
      item,
      quantity,
      totalAmount,
      advanceAmount,
      dueAmount,
      dueDate,
      paymentMode,
      notes,
      party,
      placedBy
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: newOrder
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: err.message
    });
  }
};

// Get all orders
const getAllOrder = async (req, res) => {
  try {
    const orders = await orderModel.find()
      .populate('placedBy', 'name email')
      .populate('party', 'companyName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Orders fetched successfully",
      data: orders
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: err.message
    });
  }
};


// Get single order details
const getOrderDetails = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.id)
      .populate('placedBy', 'name')
      .populate('party', 'companyName')
      .populate('assignedWarehouse', 'name')
      .populate('approvedBy', 'name')
      .populate('forwardedByManager', 'name')
      .populate('assignedToManager', 'name')
      .populate('invoicedBy', 'name')
      .populate('dispatchInfo.dispatchedBy', 'name')
      .populate('canceledBy.user', 'name email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching order details",
      error: err.message
    });
  }
};


//cancel order
const cancelOrder = async (req, res) => {
  const { id } = req.params;
  const { role, userId } = req.user; // assumed from middleware
  const { reason } = req.body;

  if (!reason) {
    return res.status(422).json({
      success: false,
      message: "Cancellation reason is required"
    });
  }

  try {
    const order = await orderModel.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    // Prevent duplicate cancellation
    if (order.orderStatus === 'Cancelled') {
      return res.status(400).json({
        success: false,
        message: "Order already cancelled"
      });
    }

    order.orderStatus = 'Cancelled';
    order.canceledBy = {
      role,
      user: userId,
      reason,
      date: new Date()
    };

    await order.save();

    res.status(200).json({
      success: true,
      message: `Order cancelled by ${role}`,
      data: order
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error cancelling order",
      error: err.message
    });
  }
};

const getOrdersToApprove = async (req, res) => {
  try {
    const orders = await orderModel.find({ orderStatus: 'WarehouseAssigned' })
      .populate('placedBy', 'name email') // Optional: get salesman info
      .populate('assignedWarehouse', 'name location') // Optional: get warehouse info
      .populate('party', 'name contactPerson') // Optional: party info
      .sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(200).json({
        success: true,
        message: "No orders pending approval",
        data: []
      });
    }

    res.status(200).json({
      success: true,
      message: "Orders pending approval fetched successfully",
      data: orders
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching orders awaiting approval",
      error: error.message
    });
  }
};



module.exports = {
  createOrder,
  getAllOrder,
  getOrderDetails,
  cancelOrder,
  getOrdersToApprove
};