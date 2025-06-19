const User = require('../models/user.m.js');
const Crypto = require('../configs/crypto_config.js');
const generateHelper = require("../helpers/generateRandom.js");

// Cloudinary
const multer = require('multer');
const { cloudinary, storage } = require('../utils/cloudinary.js');
const upload = multer({ storage });

module.exports.register = async (req, res) => {
    if (req.cookies.tokenUser) {
        const user = await User.findOne({ tokenUser: req.cookies.tokenUser });
        if (user) return res.redirect("/page/register");
    }
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
    if (req.cookies.tokenUser) {
        const user = await User.findOne({ tokenUser: req.cookies.tokenUser });
        if (user) return res.redirect("/user/home");
    }
    res.render('login', {
        layout: 'main',
        pageTitle: 'Đăng nhập',
        username_error: req.flash('username_error')[0],
        password_error: req.flash('password_error')[0],
        success: req.flash('success')[0]
    });
};

module.exports.loginPost = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username: username });

        if (!user) {
            req.flash("username_error", "Tài khoản không tồn tại!");
            return res.redirect('/user/login');
        }

        const isMatch = await Crypto.verifyPassword(password, user.password);
        if (!isMatch) {
            req.flash("password_error", "Mật khẩu sai!");
            return res.redirect('/user/login');
        }

        res.cookie("tokenUser", user.tokenUser, {
            maxAge: 86400000,
            httpOnly: true,
        });
        req.flash("success", "Đăng nhập thành công!");

        return res.redirect('/user/home');
    } catch (err) {
        console.error("Lỗi đăng nhập:", err);
        req.flash("error", "Lỗi hệ thống khi đăng nhập!");
        return res.redirect('/user/login');
    }
};

module.exports.logout = async (req, res) => {
    res.clearCookie("tokenUser");
    req.flash("success", "Đăng xuất thành công!");
    return res.redirect('/user/login');
}

module.exports.home = async(req, res) => {
    res.render('home', {
        layout: 'main',
        pageTitle: 'Trang chủ'
    });
};

// controllers/about.controller.js
module.exports.showAboutPage = (req, res) => {
    res.render('about', {
        layout: 'main',
        hideSidebar:true 
    });
};



module.exports.load_thong_tin_tai_khoan = async (req, res) => {
  try {
    res.render('thong_tin_tai_khoan', {
      layout: 'main',
      title: 'Thông tin tài khoản',
      error: req.flash('error'),
      success: req.flash('success')
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};

module.exports.update_thong_tin_tai_khoan = async (req, res) => {
  const { email, phone, addr } = req.body; 
  try {
    const user = await User.findOne({ tokenUser: res.locals.user.tokenUser });
    if (!user) {
      req.flash("error", "Không tìm thấy người dùng!");
      return res.redirect("/user/info");
    }

    
    user.set({
          email: email || user.email,
          phone: phone || user.phone,
          address: addr || user.address
    });
    
    await user.save();

    req.flash("success", "Cập nhật thông tin tài khoản thành công!");
    return res.redirect("/user/info");
  } catch (err) {
    if (err.name === "ValidationError") {
      const messages = Object.values(err.errors).map(e => e.message);
      req.flash("error", "Lỗi xác thực: " + messages.join(", "));
      return res.redirect("/user/info");
    } else {
      console.error("Lỗi khác khi lưu user:", err);
      req.flash("error", "Lỗi hệ thống khi lưu thông tin tài khoản!");
      return res.redirect("/user/info");
    }
  }
};

module.exports.upload_avatar = async (req, res) => {
  try {
    const user = await User.findOne({ tokenUser: res.locals.user.tokenUser });
    if (!user) {
      req.flash("error", "Không tìm thấy người dùng!");
      return res.redirect("/user/info");
    }

    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'avatars'
      });
      user.avatar = result.secure_url;
      await user.save();
      req.flash("success", "Cập nhật ảnh đại diện thành công!");
    } else {
      req.flash("error", "Vui lòng chọn một ảnh để tải lên.");
    }

    return res.redirect("/user/info");
  } catch (err) {
    console.error("Lỗi upload avatar:", err);
    req.flash("error", "Lỗi hệ thống khi cập nhật ảnh đại diện!");
    return res.redirect("/user/info");
  }
};