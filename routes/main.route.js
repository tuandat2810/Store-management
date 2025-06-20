require('dotenv').config();

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware")
const mainController = require('../controllers/main.controller');


router.get("/report", authMiddleware.requireAuth, mainController.report);
router.post("/report", authMiddleware.requireAuth, mainController.report);

router.get('/dai-ly-suggestions', mainController.search);

module.exports = router;
