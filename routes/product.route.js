const express = require("express");
const router = express.Router();

const productController = require('../controllers/product.controller.js');

router.post('/api/product/add', productController.createProduct);
router.put('/api/product', productController.updateProduct);
router.delete('/api/product/:id', productController.deleteProduct);

router.post('/api/unit/add', productController.createUnit);
router.put('/api/unit/:value', productController.updateUnit);
router.delete('/api/unit/:value', productController.deleteUnit);

module.exports = router;