const User = require('../models/user.m.js');
const Crypto = require('../configs/crypto_config.js');
const generateHelper = require("../helpers/generateRandom.js");
module.exports.register = async (req, res) => {
    res.render('register', {
        layout: 'main',
        pageTitle: 'Đăng ký',
        error: req.flash('error')[0],
        success: req.flash('success')[0]
    });
};

module.exports.registerPost = async (req, res) => {
    const { username, password, confirmPassword, fullname, email } = req.body;

    try {
        // Kiểm tra username đã tồn tại
        const existedUser = await User.findOne({ username: username });
        if (existedUser) {
            req.flash("error", "Username đã tồn tại!");
            return res.redirect('/page/register');
        }

        // Kiểm tra mật khẩu nhập lại
        if (password !== confirmPassword) {
            req.flash("error", "Mật khẩu không khớp!");
            return res.redirect('/page/register');
        }

        const hashedPassword = await Crypto.hashedPassword(password);

        const newUser = new User({
            username,
            password: hashedPassword,
            fullname,
            email,
            type: 'user'
        });

        await newUser.save();

        res.cookie("tokenUser", newUser.tokenUser, {
            maxAge: 86400000,
            httpOnly: true,
        });

        // Chuyển sang trang đăng nhập sau khi đăng ký
        req.flash("success", "Đăng ký thành công. Hãy đăng nhập!");
        return res.redirect('/page/login');
    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        req.flash("error", "Lỗi hệ thống khi đăng ký!");
        return res.redirect('/page/register');
    }
};

module.exports.login = async (req, res) => {
    res.render('login', {
        layout: 'main',
        pageTitle: 'Đăng nhập',
        error: req.flash('error')[0],
        success: req.flash('success')[0]
    });
};

module.exports.loginPost = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username });

        if (!user) {
            req.flash("error", "Username không tồn tại!");
            return res.redirect('/page/login');
        }

        const isMatch = await Crypto.verifyPassword(password, user.password);
        if (!isMatch) {
            req.flash("error", "Sai mật khẩu!");
            return res.redirect('/page/login');
        }

        res.cookie("tokenUser", user.tokenUser, {
            maxAge: 86400000,
            httpOnly: true,
        });
        return res.redirect('/page/home');
    } catch (err) {
        console.error("Lỗi đăng nhập:", err);
        req.flash("error", "Lỗi hệ thống khi đăng nhập!");
        return res.redirect('/page/login');
    }
};

module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    req.flash("success", "Đăng xuất thành công!");
    return res.redirect('/page/login');
}

module.exports.home = async(req, res) => {
    res.render('home', {
        layout: 'main',
        pageTitle: 'Trang chủ',
    });
};

// controllers/about.controller.js
exports.showAboutPage = (req, res) => {
    res.render('about', {
        layout: 'main',
        hideSidebar:true 
    });
};