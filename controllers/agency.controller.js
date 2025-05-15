const Agency = require('../models/agency.m.js');

module.exports.dang_ky_dai_lyPOST = async (req, res) => {
    const { agencyCode, agencyName, agencyType, email, phoneNumber, district, address } = req.body;
    try {
        const newAgency = new Agency({
            agencyCode,
            managerUsername: user.fullname,
            name: agencyName,
            type: agencyType,
            email,
            phone: phoneNumber,
            district,
            address,
            acceptedDate: new Date().toISOString()
        });

        await newAgency.save();

        req.flash("success", "Đăng ký đại lý thành công.");
    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        req.flash("error", "Lỗi hệ thống khi đăng ký đại lý!");
    }
};