const Agency = require('../models/agency.m.js');
const District = require('../models/district.m.js');
const AgencyType = require('../models/agencytype.m.js');

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

module.exports.update_max_agency = async (req, res) => {
    try {
    const { districtId, maximumAgenciesAvailable } = req.body;

    if (!districtId || isNaN(maximumAgenciesAvailable)) {
      return res.status(400).json({ message: 'Thiếu dữ liệu hoặc dữ liệu không hợp lệ.' });
    }

    // Kiểm tra có vi phạm số đại lý trong quận hiện tại hay không
    const agency = await Agency.countDocuments({ district: districtId, status: 'Đã duyệt' });
    if (agency > maximumAgenciesAvailable) {
      return res.status(400).json({ message: `Số đại lý hiện tại (${agency}) đã vượt quá giới hạn mới (${maximumAgenciesAvailable}).` });
    }
    

    const updatedDistrict = await District.findOneAndUpdate(
      { id: districtId },
      { maximumAgenciesAvailable },
      { new: true }
    );

    if (!updatedDistrict) {
      return res.status(404).json({ message: 'Không tìm thấy quận để cập nhật.' });
    }

    return res.json({ message: 'Cập nhật thành công.', district: updatedDistrict });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi máy chủ.' });
  }
};


module.exports.createAgencyType = async (req, res) => {
  try {
      const { type, description, maximumDebt } = req.body;
      if (!type || !description || !maximumDebt) {
        return res.status(400).json({ message: 'Thiếu dữ liệu.' });
      }

      const exists = await AgencyType.findOne({ type });
      if (exists) {
        return res.status(409).json({ message: 'Loại đại lý đã tồn tại.' });
      }

      const newType = new AgencyType({ type, description, maximumDebt });
      await newType.save();

      res.json({ message: 'Thêm loại đại lý thành công.' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports.updateAgencyType = async (req, res) => {
  try {
      const { type, description, maximumDebt } = req.body;
      if (!type || !description || !maximumDebt) {
        return res.status(400).json({ message: 'Thiếu dữ liệu.' });
      }

      const updatedType = await AgencyType.findOneAndUpdate(
        { type },
        { description, maximumDebt },
        { new: true }
      );

      if (!updatedType) {
        return res.status(404).json({ message: 'Loại đại lý không tồn tại.' });
      }

      res.json({ message: 'Cập nhật loại đại lý thành công.', type: updatedType });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi server' });
  }
};

module.exports.deleteAgencyType = async (req, res) => {
  try {
      const { type } = req.params;
      if (!type) {
        return res.status(400).json({ message: 'Thiếu loại đại lý.' });
      }

      const deletedType = await AgencyType.findOneAndDelete({ type });
      if (!deletedType) {
        return res.status(404).json({ message: 'Loại đại lý không tồn tại.' });
      }

      res.json({ message: 'Xóa loại đại lý thành công.' });
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Lỗi server' });
  }
};