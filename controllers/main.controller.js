const generateRandom = require('../helpers/generateRandom');
const Agency = require('../models/agency.m.js');
const getDate = require('../helpers/getDate');

module.exports.load_dang_ki_dai_ly = async (req, res) => {
  const agencyCode = await generateRandom.generateUniqueAgencyCode()
  const data = { agencyCode };

  try {
    res.render('dang_ki_dai_ly', {
      layout: 'main',
      title: 'Đăng ký đại lý',
      ...data
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};

module.exports.load_danh_sach_dai_ly = async (req, res) => {
  try {
        const numberAgencyPerPage = 5;
    const page = parseInt(req.query.page) || 1;

    const searchQuery = req.query.search || '';
    
    const agencyList = await Agency.find({
      $and: [
        { managerUsername: res.locals.user.fullname },
        {
          $or: [
            { agencyCode: { $regex: searchQuery, $options: 'i' } },
            { name: { $regex: searchQuery, $options: 'i' } },
            { managerUsername: { $regex: searchQuery, $options: 'i' } },
            { district: { $regex: searchQuery, $options: 'i' } },
            { address: { $regex: searchQuery, $options: 'i' } },
          ],
        },
      ],
    })
      .skip((page - 1) * numberAgencyPerPage)
      .limit(numberAgencyPerPage)
      .lean();

    const cntAgency = await Agency.countDocuments({
      $and: [
        { managerUsername: res.locals.user.fullname },
        {
          $or: [
            { agencyCode: { $regex: searchQuery, $options: 'i' } },
            { name: { $regex: searchQuery, $options: 'i' } },
            { managerUsername: { $regex: searchQuery, $options: 'i' } },
            { district: { $regex: searchQuery, $options: 'i' } },
            { address: { $regex: searchQuery, $options: 'i' } },
          ],
        },
      ],
    })

    const cntPage = Math.ceil(cntAgency / numberAgencyPerPage);

    // Tạo mảng danh sách số trang [1, 2, 3, ..., cntPage]
    const pages = Array.from({ length: cntPage }, (_, i) => i + 1);

    res.render('danh_sach_dai_ly', {
      layout: 'main',
      title: 'Danh sách đại lý',
      agencyList,
      currentPage: page,
      cntPage,
      pages,
      searchQuery, // Truyền từ khóa tìm kiếm vào view
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};


module.exports.load_danh_sach_dai_ly_admin = async (req, res) => {
  try {
    const numberAgencyPerPage = 5;
    const page = parseInt(req.query.page) || 1;

    const searchQuery = req.query.search || '';
    
    const agencyList = await Agency.find({
      $or: [
        { agencyCode: { $regex: searchQuery, $options: 'i' } },
        { name: { $regex: searchQuery, $options: 'i' } },
        { managerUsername: { $regex: searchQuery, $options: 'i' } },
        { district: { $regex: searchQuery, $options: 'i' } },
        { address: { $regex: searchQuery, $options: 'i' } },
      ],
    })
      .skip((page - 1) * numberAgencyPerPage)
      .limit(numberAgencyPerPage)
      .lean();

    const cntAgency = await Agency.countDocuments({
      $or: [
        { agencyCode: { $regex: searchQuery, $options: 'i' } },
        { name: { $regex: searchQuery, $options: 'i' } },
        { managerUsername: { $regex: searchQuery, $options: 'i' } },
        { district: { $regex: searchQuery, $options: 'i' } },
        { address: { $regex: searchQuery, $options: 'i' } },
      ],
    });

    const cntPage = Math.ceil(cntAgency / numberAgencyPerPage);

    // Tạo mảng danh sách số trang [1, 2, 3, ..., cntPage]
    const pages = Array.from({ length: cntPage }, (_, i) => i + 1);

    res.render('danh_sach_dai_ly_admin', {
      layout: 'main',
      title: 'Danh sách đại lý Admin',
      agencyList,
      currentPage: page,
      cntPage,
      pages,
      searchQuery, // Truyền từ khóa tìm kiếm vào view
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};

module.exports.search = async (req, res) => {
  const query = req.query.query || '';
  if (!query) return res.json([]);

  try {
    const results = await Agency.find({
      name: { $regex: query, $options: 'i' }
    }).limit(5).select('name').lean();

    res.json(results.map(a => a.name));
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
}




module.exports.load_bao_cao_hang_thang = async (req, res) => {
  try {
    res.render('bao_cao_hang_thang', {
      layout: 'main',
      title: 'Báo cáo hàng tháng'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};

module.exports.load_bao_cao_hang_thang_admin = async (req, res) => {
  try {
    res.render('bao_cao_hang_thang_admin', {
      layout: 'main',
      title: 'Báo cáo hàng tháng Admin'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};

module.exports.load_duyet_phieu_xuat_hang = async (req, res) => {
  try {
    res.render('duyet_phieu_xuat_hang', {
      layout: 'main',
      title: 'Duyệt phiếu xuất hàng'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};

module.exports.load_lap_phieu_thu_tien = async (req, res) => {
  try {
    res.render('lap_phieu_thu_tien', {
      layout: 'main',
      title: 'Lập phiếu thu tiền'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};

module.exports.load_lap_phieu_xuat_hang = async (req, res) => {
  try {
    res.render('lap_phieu_xuat_hang', {
      layout: 'main',
      title: 'Lập phiếu xuất hàng'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};

module.exports.load_quan_ly_dai_ly_admin = async (req, res) => {
  try {
    res.render('quan_ly_dai_ly_admin', {
      layout: 'main',
      title: 'Quản lý đại lý Admin'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};

module.exports.load_quan_ly_loai_dai_ly = async (req, res) => {
  try {
    res.render('quan_ly_loai_dai_ly', {
      layout: 'main',
      title: 'Quản lý loại đại lý'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};

module.exports.load_thay_doi_quy_dinh = async (req, res) => {
  try {
    res.render('thay_doi_quy_dinh', {
      layout: 'main',
      title: 'Thay đổi quy định'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};

module.exports.load_thong_tin_admin = async (req, res) => {
  try {
    res.render('thong_tin_admin', {
      layout: 'main',
      title: 'Thông tin admin'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};

module.exports.load_thong_tin_dai_ly = async (req, res) => {
  try {
    res.render('thong_tin_dai_ly', {
      layout: 'main',
      pageTitle: 'Thông tin đại lý'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};

module.exports.dang_ky_dai_lyPOST = async (req, res) => {
    const { agencyCode, agencyName, agencyType, email, phoneNumber, district, address } = req.body;

    try {
      const user = res.locals.user;
      const fullname = user.fullname;
      const newAgency = new Agency({
          agencyCode,
          managerUsername: fullname,
          name: agencyName,
          type: agencyType,
          email,
          phone: phoneNumber,
          district,
          address,
          acceptedDate: new Date().toISOString(),
          status: "Đang chờ",
      });

      await newAgency.save();

      req.flash("success", "Đăng ký đại lý thành công.");
      return res.redirect("/main/dang_ki_dai_ly");

    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      req.flash("error", "Lỗi hệ thống khi đăng ký đại lý!");
      return res.redirect("/main/dang_ki_dai_ly");
    }
};