require('dotenv').config();

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware")
const agencyController = require('../controllers/agency.controller');

router.post('/api/agency/update-status', authMiddleware.requireAuth, agencyController.update_status);

module.exports = router;