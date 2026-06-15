const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const router = express.Router();


// user routes
router.post('/place-order', authMiddleware.isAuthenticated, userController.placeOrder);
router.post('/cancel-order/:id', authMiddleware.isAuthenticated, userController.cancelOrder);
router.post('/comment/:id', authMiddleware.isAuthenticated, userController.commentProduct);
router.post('/like/:id', authMiddleware.isAuthenticated, userController.likeProduct);
router.get('/orders', authMiddleware.isAuthenticated, userController.getAllOrders);


// seller routes
router.get('/orders/seller', authMiddleware.isAuthenticated, authMiddleware.isSeller, userController.getAllOrdersForEachSellerProducts);


// admin routes
// router.get('/orders/admin', authMiddleware.isAuthenticated, authMiddleware.isAdmin, userController.);



module.exports = router;