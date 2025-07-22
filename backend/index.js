const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// // Routes
const salesmanRoutes = require('./routes/salesmanRouter');
// const orderRoutes = require('./routes/orderRouter');
const adminRoutes = require('./routes/adminRouter');
const managerRoutes = require('./routes/managerRouter');
const authorizerRoutes = require('./routes/authorizerRouter');
const plantHeadRoutes = require('./routes/plantheadRouter');
const accountantRoutes = require('./routes/accountantRouter');
const connectDatabase = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDatabase();


// Routes

// app.use('/api/order', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/salesman', salesmanRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/authorizer', authorizerRoutes);
app.use('/api/planthead', plantHeadRoutes);
app.use('/api/accountant', accountantRoutes);

// Root
app.get('/', (req, res) => {
  res.send('🐣 Poultry Feed Management API Running...');
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
