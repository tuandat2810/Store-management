const generateRandom = require('../helpers/generateRandom');
const Agency = require('../models/agency.m.js');
const getDate = require('../helpers/getDate');

module.exports.load_dang_ki_dai_ly = async (req, res) => {
  const agencyCode = await generateRandom.generateUniqueAgencyCode()
  const data = { agencyCode };

  console.log(res.locals.user.fullname);
  const fullname = res.locals.user.fullname;
  console.log(fullname);
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
    

    res.render('danh_sach_dai_ly', {
      layout: 'main',
      title: 'Danh sách đại lý'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};

module.exports.load_danh_sach_dai_ly_admin = async (req, res) => {
  try {
    const numberAgencyPerPage = 5;

    // Lấy số trang hiện tại từ query, mặc định là 1
    const page = parseInt(req.query.page) || 1;

    // Đếm tổng số đại lý
    const cntAgency = await Agency.countDocuments();

    // Tính tổng số trang
    const cntPage = Math.ceil(cntAgency / numberAgencyPerPage);

    // Lấy danh sách đại lý của trang hiện tại
    const agencyList = await Agency.find()
      .skip((page - 1) * numberAgencyPerPage)
      .limit(numberAgencyPerPage)
      .lean();

    // Tạo mảng danh sách số trang [1, 2, 3, ..., cntPage]
    const pages = Array.from({ length: cntPage }, (_, i) => i + 1);

    res.render('danh_sach_dai_ly_admin', {
      layout: 'main',
      title: 'Danh sách đại lý Admin',
      agencyList,
      currentPage: page,
      cntPage,
      pages,
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};


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
      console.log(user);
      const fullname = user.fullname;
      console.log(fullname);
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
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      req.flash("error", "Lỗi hệ thống khi đăng ký đại lý!");
    }
};