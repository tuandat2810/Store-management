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

    // Kiểm tra định dạng email đơn giản
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

// module.exports.forgotPasswordPost =  (req,res, next) => {
//     if(!req.body.email) {
//         req.flash('error', `Vui lòng nhập email`);
//         res.redirect("back");
//         return;
//     }
//     // dùng cái này để nó chạy sang phần kế tiếp để xử lí tiếp logic (trong file product.route)
//     next();
// }

// module.exports.resetPasswordPost =  (req,res, next) => {
//     if(!req.body.password) {
//         req.flash('error', `Vui lòng nhập mật khẩu mới`);
//         res.redirect("back");
//         return;
//     }

//     if(!req.body.confirmPassword) {
//         req.flash('error', `Vui lòng xác nhận mật khẩu`);
//         res.redirect("back");
//         return;
//     }

//     if(req.body.confirmPassword != req.body.password) {
//         req.flash('error', `Mật khẩu xác nhận không trùng khớp`);
//         res.redirect("back");
//         return;
//     }

//     // dùng cái này để nó chạy sang phần kế tiếp để xử lí tiếp logic (trong file product.route)
//     next();
// }

module.exports.update_thong_tin_tai_khoan = (req, res, next) => {
    const { email, phone } = req.body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^(0|\+84)(\d{9})$/;

    if (email && !emailRegex.test(email)) {
        req.flash("error", "Email không hợp lệ!");
        return res.redirect("/user/info");
    }

    if (phone && !phoneRegex.test(phone)) {
        req.flash("error", "Số điện thoại không hợp lệ!");
        return res.redirect("/user/info");
    }

    next();
}