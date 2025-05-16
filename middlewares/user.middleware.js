const User = require("../models/user.m");

// module.exports.infoUser = async (req, res, next) => {
//     if(req.cookies.tokenUser) {
//         const user = await User.findOne({
//             tokenUser: req.cookies.tokenUser
//         })
//         if(user) {
//             res.locals.user = user;
//         }
//     }
//     next();
// }

module.exports.infoUser = async (req, res, next) => {
    if (req.cookies.tokenUser) {
        const user = await User.findOne({ tokenUser: req.cookies.tokenUser });
        if (user) {
            res.locals.user = user;
            console.log("Middleware infoUser: user found", user.username); // check
        } else {
            console.log("Middleware infoUser: no user found");
        }
    } else {
        console.log("Middleware infoUser: no tokenUser cookie");
    }
    next();
};