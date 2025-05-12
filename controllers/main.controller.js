const generateRandom = require('../helpers/generateRandom');
const Agency = require('../models/agency.m.js');

module.exports.load_dang_ki_dai_ly = async (req, res) => {
  try {
    res.render('dang_ki_dai_ly', {
      layout: 'main',
      title: 'Đăng ký đại lý'
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
    res.render('danh_sach_dai_ly_admin', {
      layout: 'main',
      title: 'Danh sách đại lý Admin'
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
      title: 'Thông tin đại lý'
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};

module.exports.dang_ky_dai_lyPOST = async (req, res) => {
    const { agencyCode, agencyName, agencyType, email, phoneNumber, district, address } = req.body;

    console.log('Usename: ', user.fullname);
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