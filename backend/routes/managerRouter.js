
const express = require('express');
const managerRouter = express.Router();
const {
  loginSalesManager,
  getAssignedOrders,
  forwardOrderToAuthorizer,
  getOrderDetails,
  getForwardedOrders
} = require('../controllers/Salesmanager');

const { verifySalesmanager } = require('../middleware/verifySalesmanager');

// Sales Manager Login
managerRouter.post('/login', loginSalesManager);

// View all orders assigned to this Sales Manager (not yet forwarded)
managerRouter.get('/orders/getAll',verifySalesmanager, getAssignedOrders);

managerRouter.get('/orders/:orderId',verifySalesmanager, getOrderDetails);

// Forward order to Authorizer
managerRouter.put('/forward/:orderId',verifySalesmanager, forwardOrderToAuthorizer);


// Get all forwarded orders
managerRouter.get('/orders/forwarded', verifySalesmanager, getForwardedOrders);

module.exports = managerRouter;