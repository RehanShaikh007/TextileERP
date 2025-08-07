import express from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from "../controller/productController.js";
import { createStock, getAllStocks, getStockById, updateStock, deleteStock } from '../controller/stockController.js';
import { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder } from '../controller/orderController.js';
import { createCustomer, getAllCustomers, getCustomerById, updateCustomer, deleteCustomer } from '../controller/customerController.js';
import { createReturn, getAllReturns, getReturnById, updateReturn, deleteReturn } from '../controller/returnController.js';
import { uploadImages } from '../controller/imageController.js';
import { upload } from '../middleware/uploadMiddleware.js';


const router = express.Router();
// Product Routes
router.post('/products/addProduct', createProduct);
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

router.post('/products/upload-images', upload.array('images', 5), uploadImages);

// Stock Routes
router.post('/stock/addStock', createStock);
router.get('/stock', getAllStocks);
router.get('/stock/:id', getStockById);
router.put('/stock/:id', updateStock);
router.delete('/stock/:id', deleteStock);

// Order Routes
router.post('/order/addOrder', createOrder);
router.get('/order', getAllOrders);
router.get('/order/:id', getOrderById);
router.put('/order/:id', updateOrder);
router.delete('/order/:id', deleteOrder);

// Customer Routes
router.post('/customer/addCustomer', createCustomer);
router.get('/customer', getAllCustomers);
router.get('/customer/:id', getCustomerById);
router.put('/customer/:id', updateCustomer);
router.delete('/customer/:id', deleteCustomer);

// Return Routes
router.post('/return/addReturn', createReturn);
router.get('/return', getAllReturns);
router.get('/return/:id', getReturnById);
router.put('/return/:id', updateReturn);
router.delete('/return/:id', deleteReturn);

export default router;