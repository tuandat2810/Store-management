const User = require('../models/user.m.js');
const Crypto = require('../configs/crypto_config.js');
const generateRandomNumber = require("../helpers/generateRandom.js");
const ForgotPassword = require('../models/forgot-password.m.js')
const { BrevoProvider } = require('../helpers/BrevoProvider.js')
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
        const existedUser = await User.findOne({ username: username });
        if (existedUser) {
            req.flash("error", "Username đã tồn tại!");
            return res.redirect('/page/register');
        }

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
        if (user) return res.redirect("/page/home");
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
            return res.redirect('/page/login');
        }

        const isMatch = await Crypto.verifyPassword(password, user.password);
        if (!isMatch) {
            req.flash("password_error", "Mật khẩu sai!");
            return res.redirect('/page/login');
        }

        res.cookie("tokenUser", user.tokenUser, {
            maxAge: 86400000,
            httpOnly: true,
        });
        req.flash("success", "Đăng nhập thành công!");
        
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
        pageTitle: 'Trang chủ'
    });
};

module.exports.showAboutPage = (req, res) => {
    res.render('about', {
        layout: 'main',
        hideSidebar:true 
    });
};

module.exports.forgotPassword = (req, res) => {
    res.render('forgotPassword', {
        layout: 'main',
        pageTitle: 'Quên mật khẩu',
        error: req.flash('error')[0],
        success: req.flash('success')[0]
    });
}

module.exports.forgotPasswordPost = async (req, res) => {

    const { email } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            req.flash("error", "Tài khoản không tồn tại!");
            return res.redirect('/page/forgot-password');
        }

        const otp = generateRandomNumber.generateRandomNumber(8);

        const objectForgotPassword = {
            email: email,
            OTP: otp,
            expireAt: Date.now() + 180000
        }

        const forgotPassword = new ForgotPassword(objectForgotPassword);
        await forgotPassword.save();

        const subject = "Mã xác thực OTP để lấy lại mật khẩu của bạn ";
        const html = `Mã OTP để lấy lại mật khẩu là: <b>${otp}</b>. Thời hạn sử dụng là 3p`;
        await BrevoProvider.sendEmail(email, subject, html);

        req.flash("success", "Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến!");
        res.redirect(`/page/password/otp?email=${email}`);

    } catch (error) {
        console.error("Lỗi quên mật khẩu:", error);
        req.flash("error", "Lỗi hệ thống khi quên mật khẩu!");
        return res.redirect('/page/forgot-password');
    }

}

module.exports.resendOtp = async (req, res) => {
    const { email } = req.query;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            req.flash("error", "Email không hợp lệ!");
            return res.redirect("/page/forgot-password");
        }

        const otp = generateRandomNumber.generateRandomNumber(8);
        const objectForgotPassword = {
            email,
            OTP: otp,
            expireAt: Date.now() + 180000
        };

        await ForgotPassword.deleteMany({ email });
        await new ForgotPassword(objectForgotPassword).save();

        const subject = "Mã OTP mới để lấy lại mật khẩu";
        const html = `Mã OTP mới là: <b>${otp}</b>. Thời hạn sử dụng là 3 phút.`;
        await BrevoProvider.sendEmail(email, subject, html);

        req.flash("success", "Yêu cầu gửi lại mã OTP thành công! Vui lòng kiểm tra email của bạn.");
        res.redirect(`/page/password/otp?email=${email}`);
    } catch (error) {
        console.error("Lỗi gửi lại OTP:", error);
        req.flash("error", "Có lỗi xảy ra khi gửi lại OTP.");
        res.redirect("/page/forgot-password");
    }
};


module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;
    try {
        res.render('otpPassword', {
            layout: 'main',
            pageTitle: 'Xác minh OTP',
            email: email,
            success: req.flash('success')[0],
            error: req.flash('error')[0]
        });
    } catch (err) {
        console.error('Render lỗi:', err);
    }

}

module.exports.otpPasswordPost = async (req, res) => {
    const { email, otp } = req.body;
    console.log('email: ', email);
    console.log('otp: ', otp);
    try {
        const forgotPassword = await ForgotPassword.findOne({
            email: email,
            OTP: otp,
            expireAt: { $gt: Date.now() }
        }); 
        if (!forgotPassword) {
            req.flash("error", "Mã OTP không hợp lệ hoặc đã hết hạn!");
            return res.redirect(`/page/password/otp?email=${email}`);
        }
        res.render('resetPassword', {
            layout: 'main',
            pageTitle: 'Đặt lại mật khẩu',
            email: email
        });
    } catch (error) {
        console.error("Lỗi xác minh OTP:", error);
        req.flash("error", "Lỗi hệ thống khi xác minh OTP!");
        return res.redirect(`/page/password/otp?email=${email}`);
    }
}

module.exports.resetPassword = async (req, res) => {
    const email = req.query.email;
    res.render('resetPassword', {
        layout: 'main',
        pageTitle: 'Đặt lại mật khẩu',
        email: email,
        error: req.flash('error')[0],
        success: req.flash('success')[0]
    });
}

module.exports.resetPasswordPost = async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    console.log('RESETPOST:')
    console.log('email: ', email);
    console.log('password: ', password);
    console.log('confirmPassword: ', confirmPassword);
    try {
        if (password !== confirmPassword) {
            req.flash("error", "Mật khẩu không khớp!");
            return res.redirect(`/page/password/reset?email=${email}`);
        }

        const hashedPassword = await Crypto.hashedPassword(password);

        await User.updateOne({ email: email }, { password: hashedPassword });

        await ForgotPassword.deleteOne({ email: email });

        req.flash("success", "Đặt lại mật khẩu thành công!");
        return res.redirect('/page/login');
    } catch (error) {
        console.error("Lỗi đặt lại mật khẩu:", error);
        req.flash("error", "Lỗi hệ thống khi đặt lại mật khẩu!");
        return res.redirect(`/page/password/reset?email=${email}`);
    }
}