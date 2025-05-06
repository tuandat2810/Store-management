const mongoose = require('mongoose');
const generate = require("../helpers/generateRandom");

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    tokenUser: {
        type: String,
        default: generate.generateRandomString(20)
      },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
