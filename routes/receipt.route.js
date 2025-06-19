const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware")
const receiptController = require('../controllers/receipt.controller');

router.get("/create", authMiddleware.requireAuth, receiptController.viewCreatedFormReceipt);
router.get("/view", authMiddleware.requireAuth, receiptController.viewAllReceipts);

router.post("/create", authMiddleware.requireAuth, receiptController.createReceipt);

module.exports = router;