const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware")
const orderController = require('../controllers/order.controller');

router.get("/create", authMiddleware.requireAuth, orderController.viewCreatedFormOrder);
router.get("/view", authMiddleware.requireAuth, orderController.viewAllOrders);

router.post("/create", authMiddleware.requireAuth, orderController.createOrder);

module.exports = router;