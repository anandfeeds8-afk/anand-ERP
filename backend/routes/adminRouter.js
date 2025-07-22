const express=require('express');
const adminRouter=express.Router();
const {registerAdmin,loginAdmin, addSalesman, getAllSalesman, getSalesman, updateSalesman, deleteSalesman, addSalesManager, getAllSalesManager, getSalesManager, updateSalesManager, deleteSalesManager, addSalesAuthorizer, getAllSalesAuthorizer, getSalesAuthorizer, updateSalesAuthorizer, deleteSalesAuthorizer, addWarehouse, getAllWarehouse, getWarehouse, updateWarehouse, deleteWarehouse, approveWarehouse, updateProducts, addPlantHead, getAllPlantHeads, getPlantHead, updatePlantHead, deletePlantHead, addAccountant, getAllAccountants, getAccountant, updateAccountant, deleteAccountant }=require('../controllers/Admin');

const {verifyAdmin} = require('../middleware/verifyAdmin');
const { cancelOrder, getOrderDetails,getAllOrder, getOrdersToApprove } = require('../controllers/Orders');

adminRouter.post('/register',registerAdmin);
adminRouter.post('/login',loginAdmin);


adminRouter.post('/add_salesman', verifyAdmin, addSalesman);
adminRouter.get('/get_allSalesman', verifyAdmin, getAllSalesman);
adminRouter.get('/get_salesman/:id', verifyAdmin, getSalesman);
adminRouter.put('/update_salesman/:id', verifyAdmin, updateSalesman);
adminRouter.delete('/delete_salesman/:id', verifyAdmin, deleteSalesman);


adminRouter.post('/add_salesmanager', verifyAdmin, addSalesManager);
adminRouter.get('/get_allsalesmanager', verifyAdmin, getAllSalesManager);
adminRouter.get('/get_salesmanager/:id', verifyAdmin, getSalesManager);
adminRouter.put('/update_salesmanager/:id', verifyAdmin, updateSalesManager);
adminRouter.delete('/delete_salesmanager/:id', verifyAdmin, deleteSalesManager);

adminRouter.post('/add_salesauthorizer', verifyAdmin, addSalesAuthorizer);
adminRouter.get('/get_allsalesauthorizer', verifyAdmin, getAllSalesAuthorizer);
adminRouter.get('/get_salesauthorizer/:id', verifyAdmin, getSalesAuthorizer);
adminRouter.put('/update_salesauthorizer/:id', verifyAdmin, updateSalesAuthorizer);
adminRouter.delete('/delete_salesauthorizer/:id', verifyAdmin, deleteSalesAuthorizer);


// PLANT HEAD ROUTES
adminRouter.post('/add_planthead', verifyAdmin, addPlantHead);
adminRouter.get('/get_allplantheads', verifyAdmin, getAllPlantHeads);
adminRouter.get('/get_planthead/:id', verifyAdmin, getPlantHead);
adminRouter.put('/update_planthead/:id', verifyAdmin, updatePlantHead);
adminRouter.delete('/delete_planthead/:id', verifyAdmin, deletePlantHead);

// ACCOUNTANT ROUTES
adminRouter.post('/add_accountant', verifyAdmin, addAccountant);
adminRouter.get('/get_allaccountants', verifyAdmin, getAllAccountants);
adminRouter.get('/get_accountant/:id', verifyAdmin, getAccountant);
adminRouter.put('/update_accountant/:id', verifyAdmin, updateAccountant);
adminRouter.delete('/delete_accountant/:id', verifyAdmin, deleteAccountant);


adminRouter.post('/add_warehouse', verifyAdmin, addWarehouse);
adminRouter.get('/get_allwarehouse', verifyAdmin, getAllWarehouse);
adminRouter.get('/get_warehouse/:id', verifyAdmin, getWarehouse);
adminRouter.put('/update_warehouse/:id', verifyAdmin, updateWarehouse);
adminRouter.put('/update_products/:id', verifyAdmin, updateProducts);
adminRouter.delete('/delete_warehouse/:id', verifyAdmin, deleteWarehouse);


adminRouter.get('/get_orders_to_approve', verifyAdmin, getOrdersToApprove);
adminRouter.post('/approve_warehouse', verifyAdmin, approveWarehouse);

adminRouter.get('/get_allorder', verifyAdmin, getAllOrder);
adminRouter.get('/get_order/:id', verifyAdmin, getOrderDetails);
adminRouter.post('/cancel_order/:id', verifyAdmin, cancelOrder);










module.exports=adminRouter;