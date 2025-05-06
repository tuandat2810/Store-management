const User = require('../models/user.m.js');
const Crypto = require('../configs/crypto_config.js');
const generateHelper = require("../helpers/generateRandom.js");

// const getAllUsers = async (req, res) => {
//     try {
//         const users = await User.find();
//         console.log(users);
//         res.json(users);
//     } catch (error) {
//         res.status(500).send('Lỗi server');
//     }
// };

// const login = async (req, res) => {
//     const { name, password } = req.body;

//     const users = await User.find();
//     console.log(users);
//     // const tokenUser = req.cookies.tokenUser;
//     // console.log(tokenUser);
//     try {
//         const user = await User.findOne({ username: name });

//         if (!user) {
//             return res.render('login', { error: 'Tài khoản không tồn tại' });
//         }

//         const isMatch = await Crypto.verifyPassword(password, user.password);   
//         if (!isMatch) {
//             return res.render('login', { error: 'Sai mật khẩu' });
//         }

//         res.cookie('tokenUser', user.tokenUser, { maxAge: 900000, httpOnly: true });

//         return res.render('home');
//     } catch (err) {
//         console.error(err);
//         res.render('login', { error: 'Đã xảy ra lỗi hệ thống' });
//     }
// };

// const register = async (req, res) => {
//     const { name, password } = req.body;

//     console.log(req.body);

//     try {
//         // Kiểm tra tên người dùng đã tồn tại chưa
//         const existingUser = await User.findOne({ username: name });
//         if (existingUser) {
//             return res.render('register', { error: 'Tên người dùng đã tồn tại' });
//         }

//         // Hash
//         const hashedPassword = await Crypto.hashedPassword(password);

//         const newUser = new User({
//             username: name,
//             password: hashedPassword
//         });

//         console.log('newUser', newUser);

//         await newUser.save();
//         console.log("Đăng ký thành công");
//         // console.log('Đăng ký thành công với _id:', newUser._id);
//         // Chuyển hướng sang trang đăng nhập
        
//         return res.redirect('/page/login');
//     } catch (err) {
//         console.error(err);
//         res.render('register', { error: 'Đã xảy ra lỗi khi đăng ký' });
//     }
// };

// module.exports = {
//     getAllUsers,
//     login,
//     register
// };



module.exports.register = async (req, res) => {
    res.render('register', {
        layout: 'main',
        pageTitle: 'Đăng ký',
        error: req.flash('error')[0],
        success: req.flash('success')[0]
    });
};

module.exports.registerPost = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Kiểm tra username đã tồn tại
        const existedUser = await User.findOne({ username: username });
        if (existedUser) {
            req.flash("error", "Username đã tồn tại!");
            return res.redirect('/page/register');
        }

        const hashedPassword = await Crypto.hashedPassword(password);

        const newUser = new User({
            username,
            password: hashedPassword
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
        console.log("Đăng nhập thành công với tokenUser:", user.tokenUser);

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
    // if (!req.session.user) {
    //     req.flash('error', 'Vui lòng đăng nhập');
    //     return res.redirect('/page/login');
    // }
    
    res.render('home', {
        layout: 'main',
        pageTitle: 'Trang chủ'
    });
};
