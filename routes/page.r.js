require('dotenv').config();

const express = require("express");
const Router = express.Router();

const userController = require('../controllers/user.c');

Router.get('/', (req, res) => {
    res.redirect('/page/login');
})

Router.get('/page/login', (req, res) => {
    res.render('login');
})

Router.get('/page/register', (req, res) => {
    res.render('register');
})

Router.get('/page/logout', (req, res) => {
    res.render('register');
})

// Route gọi API Mongo
Router.get('/testmongo', userController.getAllUsers);

module.exports = Router;