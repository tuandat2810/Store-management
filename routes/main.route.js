require('dotenv').config();

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware")
const mainController = require('../controllers/main.controller');

// Route AJAX: chỉ trả về HTML partial (layout: false)
router.get('/ajax/section/:name', mainController.load_main_data_section);

// Route direct: trả về full layout (layout: true hoặc có template chính)
router.get('/section/:section', authMiddleware.requireAuth, mainController.loadMainSection);

module.exports = router;
