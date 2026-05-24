const express = require('express');
const authController = require('../controllers/auth.controller');
const router = express.Router();

// Register a new user
router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser);
router.post('/admin/login', authController.loginAdmin);
router.post('/logout', authController.logoutUser);
module.exports = router;

