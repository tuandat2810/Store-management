require('dotenv').config();

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware")
const mainController = require('../controllers/main.controller');


router.get("/bao_cao_hang_thang", authMiddleware.requireAuth, mainController.load_bao_cao_hang_thang);
router.post("/bao_cao_hang_thang", authMiddleware.requireAuth, mainController.load_bao_cao_hang_thang);

router.get("/lap_phieu_thu_tien", authMiddleware.requireAuth, mainController.load_lap_phieu_thu_tien);
router.get("/xem_phieu_thu_tien", authMiddleware.requireAuth, mainController.load_xem_phieu_thu_tien);


router.get('/dai-ly-suggestions', mainController.search);

router.post("/lap_phieu_thu_tien", authMiddleware.requireAuth, mainController.lap_phieu_thu_tienPOST);
module.exports = router;
