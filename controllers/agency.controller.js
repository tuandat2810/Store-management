const Agency = require('../models/agency.m.js');

module.exports.update_status = async (req, res) => {
    try {
        const { agencyCode, status } = req.body;
        // console.log("Received agencyCode:", agencyCode);
        // console.log("Received status:", status);
        if (!agencyCode || !status) {
            return res.status(400).json({ message: 'Thiếu agencyCode hoặc status' });
        }

        
        const agency = await Agency.findOneAndUpdate({ agencyCode }, { status }, { new: true });

        if (!agency) {
            return res.status(404).json({ message: 'Không tìm thấy đại lý' });
        }

        res.json({ message: 'Cập nhật thành công', agency });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
};