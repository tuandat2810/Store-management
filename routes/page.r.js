require('dotenv').config();

const express = require("express");
const Router = express.Router();

const userController = require('../controllers/user.c');

Router.get('/', (req, res) => {
    res.redirect('/login');
})

Router.get('/login', (req, res) => {
    res.render('login');
})

Router.get('/register', (req, res) => {
    res.render('register');
})

Router.get('/logout', (req, res) => {
    res.render('register');
})

Router.post('/login', userController.login);
Router.post('/register', userController.register);

// Route gọi API Mongo
Router.get('/testmongo', userController.getAllUsers);

module.exports = Router;