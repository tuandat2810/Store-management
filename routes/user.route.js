require('dotenv').config();

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware")
const userController = require('../controllers/user.controller');
const validation = require("../validates/client/user.validate")

router.get("/register", userController.register);

router.post("/register", validation.registerPost, userController.registerPost);

router.get("/login", userController.login);

router.post("/login", validation.loginPost, userController.loginPost);

router.get("/logout", userController.logout);

router.get("/forgot-password", userController.forgotPassword);

router.post("/forgot-password", userController.forgotPasswordPost);

router.get("/password/otp", userController.otpPassword);

router.post("/password/otp", userController.otpPasswordPost);

router.get("/password/reset", userController.resetPassword);

router.post("/password/reset", userController.resetPasswordPost);

router.get("/about", authMiddleware.requireAuth, userController.showAboutPage);

router.get('/home', authMiddleware.requireAuth, userController.home);
module.exports = router;