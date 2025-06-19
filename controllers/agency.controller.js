const Agency = require('../models/agency.m.js');
const District = require('../models/district.m.js');
const AgencyType = require('../models/agencytype.m.js');

// Load quản lý đại lý
module.exports.manage = async (req, res) => {
  try {
    const searchQuery = req.query.search || '';
    const agencyList = await Agency.find({
      $or: [
        { agencyCode: { $regex: searchQuery, $options: 'i' } },
        { name: { $regex: searchQuery, $options: 'i' } },
      ],
    }).lean();



    const data = { agencyList };
    // console.log('[+] Rendering trang quản lý đại lý');
    res.render('quan_ly_dai_ly_admin', {
      layout: 'main',
      title: 'Quản lý đại lý Admin',
      ...data
    });
  } catch (err) {
    console.error(err);
    // console.log('[!] Có lỗi, render 500');
    res.status(500).render('500', { layout: false });
  }
};

function getPaginationPages(currentPage, totalPages, delta = 2) {
  const pages = [];
  const start = Math.max(1, currentPage - delta);
  const end = Math.min(totalPages, currentPage + delta);
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return pages;
}

// Load danh sách đại lý
module.exports.viewAllAgencies = async (req, res) => {
  try {
    const numberAgencyPerPage = 5;
    const page = parseInt(req.query.page) || 1;
    const searchQuery = req.query.search || '';
    const isAdmin = res.locals.user.type === 'admin';

    // Điều kiện tìm kiếm
    const searchCondition = {
      $or: [
        { agencyCode: { $regex: searchQuery, $options: 'i' } },
        { name: { $regex: searchQuery, $options: 'i' } },
        { managerUsername: { $regex: searchQuery, $options: 'i' } },
        { district: { $regex: searchQuery, $options: 'i' } },
        { address: { $regex: searchQuery, $options: 'i' } },
      ],
    };

    // Nếu là user thì thêm điều kiện quản lý đại lý
    if (!isAdmin) {
      searchCondition.$and = [{ managerUsername: res.locals.user.fullname }];
    }

    // Truy vấn danh sách đại lý
    const agencyList = await Agency.find(searchCondition)
      .skip((page - 1) * numberAgencyPerPage)
      .limit(numberAgencyPerPage)
      .lean();

    const cntAgency = await Agency.countDocuments(searchCondition);
    const cntPage = Math.ceil(cntAgency / numberAgencyPerPage);
    const pages = getPaginationPages(page, cntPage);

    res.render('danh_sach_dai_ly', {
      layout: 'main',
      title: isAdmin ? 'Danh sách đại lý Admin' : 'Danh sách đại lý',
      agencyList,
      currentPage: page,
      cntPage,
      pages,
      searchQuery,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};


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

    const updateData = { status };
    if (status === 'Đã duyệt') {
      updateData.acceptedDate = new Date();
    }

    const agency = await Agency.findOneAndUpdate({ agencyCode }, updateData, { new: true });

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