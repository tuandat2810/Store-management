const User = require('../models/user.m.js');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find(); // Lấy tất cả user
        console.log(users);
        res.json(users);
    } catch (error) {
        res.status(500).send('Lỗi server');
    }
};

module.exports = {
    getAllUsers
};
