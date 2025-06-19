require('dotenv').config();

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware")
const policyController = require('../controllers/policy.controller');

router.get("/view", authMiddleware.requireAuth, policyController.view);

module.exports = router;


