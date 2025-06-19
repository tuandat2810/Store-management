require('dotenv').config();

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware")
const userController = require('../controllers/user.controller');
const validation = require("../validates/client/user.validate")

// upload middleware
const upload = require('../middlewares/upload.middleware');

router.get("/register", userController.register);

router.post("/register", validation.registerPost, userController.registerPost);

router.get("/login", userController.login);

router.post("/login", validation.loginPost, userController.loginPost);

router.get("/logout", userController.logout);

router.get("/about", authMiddleware.requireAuth, userController.showAboutPage);

router.get('/home', authMiddleware.requireAuth, userController.home);


router.post("/upload_avatar", authMiddleware.requireAuth, upload.single('avatar'), userController.upload_avatar);
router.get("/info", authMiddleware.requireAuth, userController.load_thong_tin_tai_khoan);
router.post("/info", authMiddleware.requireAuth, validation.update_thong_tin_tai_khoan, userController.update_thong_tin_tai_khoan);


module.exports = router;