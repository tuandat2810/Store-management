require('dotenv').config();

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const agencyController = require('../controllers/agency.controller');

router.post('/api/agency/update-status', authMiddleware.requireAuth, agencyController.update_status);
router.post('/api/district/update-max-agency', authMiddleware.requireAuth, agencyController.update_max_agency);

router.post('/api/agencytype/add', agencyController.createAgencyType);
router.put('/api/agencytype', agencyController.updateAgencyType);
router.delete('/api/agencytype/:type', agencyController.deleteAgencyType);

module.exports = router;