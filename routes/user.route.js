require('dotenv').config();

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware")
const userController = require('../controllers/user.controller');

// router.get('/', (req, res) => {
//     res.redirect('/login');
// })

// router.get('/login', (req, res) => {
//     res.render('login');
// })

// router.get('/register', (req, res) => {
//     res.render('register');
// })

// router.get('/logout', (req, res) => {
//     res.render('register');
// })

// router.post('/login', userController.login);
// router.post('/register', userController.register);

// // Route gọi API Mongo
// router.get('/testmongo', userController.getAllUsers);

router.get("/register", userController.register);

router.post("/register" ,userController.registerPost);

router.get("/login", userController.login);

router.post("/login",userController.loginPost);

router.get("/logout", userController.logout);

router.get("/about", authMiddleware.requireAuth, userController.showAboutPage);

router.get('/home', authMiddleware.requireAuth, userController.home);
module.exports = router;