module.exports.registerPost = (req, res, next) => {
    const { username, fullname, email, password, confirmPassword } = req.body;

    if (!username) {
        console.log("Nhập username đi !")
        req.flash('error', 'Vui lòng nhập tên tài khoản');
        return res.redirect("back");
    }

    if (!fullname) {
        req.flash('error', 'Vui lòng nhập họ tên');
        return res.redirect("back");
    }

    if (!email) {
        req.flash('error', 'Vui lòng nhập email');
        return res.redirect("back");
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        req.flash('error', 'Email không hợp lệ');
        return res.redirect("back");
    }

    if (!password) {
        req.flash('error', 'Vui lòng nhập mật khẩu');
        return res.redirect("back");
    }

    if (!confirmPassword) {
        req.flash('error', 'Vui lòng nhập lại mật khẩu');
        return res.redirect("back");
    }

    if (password !== confirmPassword) {
        req.flash('error', 'Mật khẩu không khớp');
        return res.redirect("back");
    }

    next();
};

module.exports.loginPost =  (req,res, next) => {
    if(!req.body.username) {
        req.flash('error', `Vui lòng nhập tài khoản`);
        res.redirect("back");
        return;
    }

    if(!req.body.password) {
        req.flash('error', `Vui lòng nhập mật khẩu`);
        res.redirect("back");
        return;
    }
    next();
}