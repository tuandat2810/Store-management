require('dotenv').config();

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware")
const mainController = require('../controllers/main.controller');
const { requireAuth } = require("../middlewares/auth.middleware");

// Route load section
router.get("/section/dang_ki_dai_ly", authMiddleware.requireAuth, mainController.load_dang_ki_dai_ly);
router.get("/section/danh_sach_dai_ly", authMiddleware.requireAuth, mainController.load_danh_sach_dai_ly);
router.get("/section/danh_sach_dai_ly_admin", authMiddleware.requireAuth, mainController.load_danh_sach_dai_ly_admin);
router.get("/section/bao_cao_hang_thang", authMiddleware.requireAuth, mainController.load_bao_cao_hang_thang);
router.get("/section/bao_cao_hang_thang_admin", authMiddleware.requireAuth, mainController.load_bao_cao_hang_thang_admin);
router.get("/section/duyet_phieu_xuat_hang", authMiddleware.requireAuth, mainController.load_duyet_phieu_xuat_hang);
router.get("/section/lap_phieu_thu_tien", authMiddleware.requireAuth, mainController.load_lap_phieu_thu_tien);
router.get("/section/lap_phieu_xuat_hang", authMiddleware.requireAuth, mainController.load_lap_phieu_xuat_hang);
router.get("/section/quan_ly_dai_ly_admin", authMiddleware.requireAuth, mainController.load_quan_ly_dai_ly_admin);
router.get("/section/quan_ly_loai_dai_ly", authMiddleware.requireAuth, mainController.load_quan_ly_loai_dai_ly);
router.get("/section/thay_doi_quy_dinh", authMiddleware.requireAuth, mainController.load_thay_doi_quy_dinh);
router.get("/section/thong_tin_admin", authMiddleware.requireAuth, mainController.load_thong_tin_admin);
router.get("/section/thong_tin_dai_ly", authMiddleware.requireAuth, mainController.load_thong_tin_dai_ly);


router.post("/dang_ki_dai_ly", mainController.dang_ky_dai_lyPOST);

module.exports = router;
