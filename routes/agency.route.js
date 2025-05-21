require('dotenv').config();

const express = require("express");
const router = express.Router();

const agencyController = require('../controllers/agency.controller');

router.post('/section/dang_ki_dai_ly', agencyController.dang_ky_dai_lyPOST);

module.exports = router;