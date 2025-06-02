require('dotenv').config();

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware")
const mainController = require('../controllers/main.controller');
const { requireAuth } = require("../middlewares/auth.middleware");
const Agency = require("../models/agency.m");

// Route load section
router.get("/dang_ki_dai_ly", authMiddleware.requireAuth, mainController.load_dang_ki_dai_ly);
router.get("/danh_sach_dai_ly", authMiddleware.requireAuth, mainController.load_danh_sach_dai_ly);
router.get("/danh_sach_dai_ly_admin", authMiddleware.requireAuth, mainController.load_danh_sach_dai_ly_admin);
router.get("/bao_cao_hang_thang", authMiddleware.requireAuth, mainController.load_bao_cao_hang_thang);
router.get("/bao_cao_hang_thang_admin", authMiddleware.requireAuth, mainController.load_bao_cao_hang_thang_admin);

router.get("/lap_phieu_thu_tien", authMiddleware.requireAuth, mainController.load_lap_phieu_thu_tien);

router.get("/lap_phieu_xuat_hang", authMiddleware.requireAuth, mainController.load_lap_phieu_xuat_hang);
router.get("/xem_phieu_xuat_hang", authMiddleware.requireAuth, mainController.load_xem_phieu_xuat_hang);


router.get("/quan_ly_dai_ly_admin", authMiddleware.requireAuth, mainController.load_quan_ly_dai_ly_admin);
router.get("/quan_ly_loai_dai_ly", authMiddleware.requireAuth, mainController.load_quan_ly_loai_dai_ly);
router.get("/thay_doi_quy_dinh", authMiddleware.requireAuth, mainController.load_thay_doi_quy_dinh);
router.get("/thong_tin_admin", authMiddleware.requireAuth, mainController.load_thong_tin_admin);
router.get("/thong_tin_dai_ly", authMiddleware.requireAuth, mainController.load_thong_tin_dai_ly);

router.get('/dai-ly-suggestions', mainController.search);

router.post("/dang_ki_dai_ly", authMiddleware.requireAuth, mainController.dang_ky_dai_lyPOST);
router.post("/lap_phieu_xuat_hang", authMiddleware.requireAuth, mainController.lap_phieu_xuat_hangPOST);
router.post("/lap_phieu_thu_tien", authMiddleware.requireAuth, mainController.lap_phieu_thu_tienPOST);
module.exports = router;
