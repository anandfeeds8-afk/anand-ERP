const express = require('express');
const plantHeadRouter = express.Router();
const {
  loginPlantHead,
  getProductionChart,
  updateStock,
  dispatchOrder,
  uploadTransportInfo,
} = require('../controllers/Planthead');

const { verifyPlanthead } = require('../middleware/verifyPlanthead');

// Login
plantHeadRouter.post('/login', loginPlantHead);

// //get the orders which is assigned to this warehouse
// plantHeadRouter.get('/orders/getAll', verifyPlanthead, getAllOrders);


// // Daily production entry
// plantHeadRouter.post('/production/add',verifyPlanthead, addStock);


// //add new product
// plantHeadRouter.post('/product/add', verifyPlanthead, addProduct);

// View production chart
plantHeadRouter.get('/production/chart',verifyPlanthead, getProductionChart);

// Dispatch order
plantHeadRouter.put('/dispatch/:orderId',verifyPlanthead, dispatchOrder);

// Upload transport info (vehicle number, driver name, image URL)
plantHeadRouter.put('/transport/:orderId',verifyPlanthead, uploadTransportInfo);

module.exports = plantHeadRouter;
