const express = require('express');
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();

// Public routes for fetching products
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
// Protected routes for adding, updating, and deleting products - only accessible to authenticated users
router.post('/add', authMiddleware.isAuthenticated, authMiddleware.isSeller, productController.addProduct);
router.post('/update/:id', authMiddleware.isAuthenticated, authMiddleware.isSeller, productController.updateProduct);
router.delete('/delete/:id', authMiddleware.isAuthenticated, authMiddleware.isSeller, productController.deleteProduct);


module.exports = router;