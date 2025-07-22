const express = require("express");
const accountantRouter = express.Router();
const {
  loginAccountant,
  getDispatchedOrders,
  generateInvoice,
  getInvoiceDetails
} = require("../controllers/Accountant");
const { verifyAccountant } = require("../middleware/verifyAccountant");

// Login
accountantRouter.post("/login", loginAccountant);

// Protected Routes
accountantRouter.get("/dispatched-orders", verifyAccountant, getDispatchedOrders);
accountantRouter.post("/generate-invoice/:orderId", verifyAccountant, generateInvoice);
accountantRouter.get("/invoice/:orderId", verifyAccountant, getInvoiceDetails);

module.exports = accountantRouter;
