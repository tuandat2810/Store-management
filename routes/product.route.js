const express = require("express");
const router = express.Router();

const productController = require('../controllers/product.controller.js');

router.post('/api/product/add', productController.createProduct);
router.put('/api/product', productController.updateProduct);
router.delete('/api/product/:id', productController.deleteProduct);

module.exports = router;