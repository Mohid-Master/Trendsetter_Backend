const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
// Register a new user
router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser);
router.post('/admin/login', authController.loginAdmin);
router.post('/logout', authController.logoutUser);
router.put('/update', authMiddleware.isAuthenticated, authController.updateUser);
module.exports = router;

