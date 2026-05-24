const express = require('express');
const productController = require('../controllers/product.controller');
const router = express.Router();


// product controller functions
router.post('/add', productController.addProduct);

module.exports = router;