const Agency = require('../models/agency.m.js');
const District = require('../models/district.m.js');


module.exports.update_status = async (req, res) => {
    try {
        const { agencyCode, status, district } = req.body;
        if (!agencyCode || !status) {
            return res.status(400).json({ message: 'Thiếu agencyCode hoặc status' });
        }



        if (status === 'Đã duyệt') {
            const id = String(district);
            // console.log('id:', id);   
            const districtData = await District.findOne({ id });
            // console.log(districtData);

            if (!districtData) {                                                    
                return res.status(404).json({ message: 'Không tìm thấy quận' });
            }

            const maximumAgencies = districtData.maximumAgenciesAvailable || 4; // mặc định 4 nếu không có

            // console.log(maximumAgencies);

            const acceptedCount = await Agency.countDocuments({ district, status: 'Đã duyệt' });
            // console.log(acceptedCount);
            if (acceptedCount >= maximumAgencies) {
                return res.status(400).json({ message: `Không thể tiếp nhận thêm đại lý vì số đại lý trong quận ${district} đã đạt giới hạn ${maximumAgencies}` });
            }
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