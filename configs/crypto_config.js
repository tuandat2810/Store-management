const bcrypt = require('bcrypt');

const hashedPassword = async (password) => {
    const HashedPassword = await bcrypt.hash(password, 10);
    return HashedPassword;
}

const verifyPassword = async (password, hashed) => {
    const isMatch = await bcrypt.compare(password, hashed);
    return isMatch;
}

module.exports = { hashedPassword, verifyPassword };