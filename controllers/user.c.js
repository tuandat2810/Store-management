const User = require('../models/user.m.js');
const Crypto = require('../configs/crypto_config.js');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Lấy tất cả user
        console.log(users);
        res.json(users);
    } catch (error) {
        res.status(500).send('Lỗi server');
    }
};

const login = async (req, res) => {
    const { name, password } = req.body;

    try {
        const user = await User.findOne({ username: name });

        if (!user) {
            return res.render('login', { error: 'Tài khoản không tồn tại' });
        }

        const isMatch = await Crypto.verifyPassword(password, user.password);   
        if (!isMatch) {
            return res.render('login', { error: 'Sai mật khẩu' });
        }

        return res.render('home');
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'Đã xảy ra lỗi hệ thống' });
    }
};

const register = async (req, res) => {
    const { name, password } = req.body;

    try {
        // Kiểm tra tên người dùng đã tồn tại chưa
        const existingUser = await User.findOne({ username: name });
        if (existingUser) {
            return res.render('register', { error: 'Tên người dùng đã tồn tại' });
        }

        // Hash
        const hashedPassword = await Crypto.hashedPassword(password);

        const newUser = new User({
            username: name,
            password: hashedPassword
        });

        await newUser.save();
        // console.log('Đăng ký thành công với _id:', newUser._id);
        // Chuyển hướng sang trang đăng nhập
        
        return res.redirect('/page/login');
    } catch (err) {
        console.error(err);
        res.render('register', { error: 'Đã xảy ra lỗi khi đăng ký' });
    }
};

module.exports = {
    getAllUsers,
    login,
    register
};
