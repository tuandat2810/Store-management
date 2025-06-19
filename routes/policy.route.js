require('dotenv').config();

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware")
const policyController = require('../controllers/policy.controller');
const { requireAuth } = require("../middlewares/auth.middleware");
const validation = require('../validates/client/user.validate');


router.get("/view", authMiddleware.requireAuth, policyController.view);

module.exports = router;


