const User = require("../models/user.m");

module.exports.requireAuth = async (req,res,next) => {
    if(!req.cookies.tokenUser) {
        res.redirect(`/page/login`);
    }
    else {
        const user = await User.findOne({ tokenUser: req.cookies.tokenUser}).select("-password");
        if(!user) {
            res.redirect(`/page/login`);
        }
        else{
            res.locals.user = user;
            next();
        }
    }
}