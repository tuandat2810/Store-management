const mongoose = require('mongoose');
const generate = require("../helpers/generateRandom");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    type: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    tokenUser: {
        type: String,
        default: generate.generateRandomString(20)
    }

});

const User = mongoose.model('User', userSchema);

module.exports = User;
