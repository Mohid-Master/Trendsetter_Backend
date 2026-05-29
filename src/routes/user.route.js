const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();



router.post('/place-order', authMiddleware.isAuthenticated, userController.placeOrder);
router.post('/comment/:id', authMiddleware.isAuthenticated, userController.commentProduct);
router.post('/like/:id', authMiddleware.isAuthenticated, userController.likeProduct);
router.get('/orders', authMiddleware.isAuthenticated, userController.getAllOrders);
router.get('/orders/seller', authMiddleware.isAuthenticated, authMiddleware.isSeller, userController.getAllOrdersForEachSellerProducts);

module.exports = router;