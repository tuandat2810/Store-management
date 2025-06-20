const generateRandom = require('../helpers/generateRandom');
const Agency = require('../models/agency.m.js');
const Receipt = require('../models/receipt.m.js');



module.exports.viewCreatedFormReceipt = async (req, res) => {
  try {
    const receiptCode = await generateRandom.generateUniqueReceiptCode();
    const agencies = await Agency.find().lean();
    
    const formattedAgencies = agencies.map(agency => {
      const code = agency.agencyCode;
      const name = agency.name;
      const debt = '$' + new Intl.NumberFormat('en-US').format(agency.debt);

      const paddedCode = code.padEnd(5, ' ').replace(/ /g, '\u00A0');
      const paddedName = name.padEnd(20, ' ').replace(/ /g, '\u00A0');

      return {
        value: agency.agencyCode,
        display: `${paddedCode} | ${paddedName} | Nợ: ${debt}`
      };
    });

    const data = { receiptCode, formattedAgencies };
    res.render('lap_phieu_thu_tien', {
      layout: 'main',
      title: 'Lập phiếu thu tiền',
      ...data
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};

module.exports.viewAllReceipts = async (req, res) => {
  try {
    const userType = res.locals.user.type;
    const fullname = res.locals.user.fullname;

    let receipts;

    if (userType === 'user') {
      // 1. Tìm các agencyCode do user này quản lý
      const agencies = await Agency.find({ managerUsername: fullname }, 'agencyCode').lean();
      const agencyCodes = agencies.map(agency => agency.agencyCode);

      // 2. Lọc các phiếu thu thuộc các đại lý đó
      receipts = await Receipt.find({ agencyCode: { $in: agencyCodes } })
        .sort({ collectionDate: -1 })
        .lean();
    } else {
      // Admin thì xem tất cả
      receipts = await Receipt.find().sort({ collectionDate: -1 }).lean();
    }

    res.render('xem_phieu_thu_tien', {
      layout: 'main',
      title: 'Xem phiếu thu tiền',
      receipts
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};



module.exports.createReceipt = async (req, res) => {
  try {
    const { maphieu, agencyCode, sotien, ghichu } = req.body;

    // 1. Kiểm tra dữ liệu bắt buộc
    if (!maphieu || !agencyCode || !sotien) {
      req.flash('error', 'Thiếu thông tin bắt buộc!');
      return res.redirect('/receipt/create');
    }

    const amount = parseFloat(sotien);
    if (isNaN(amount) || amount <= 0) {
      req.flash('error', 'Số tiền không hợp lệ!');
      return res.redirect('/receipt/create');
    }

    // 2. Tìm đại lý
    const agency = await Agency.findOne({ agencyCode });
    if (!agency) {
      req.flash('error', 'Không tìm thấy đại lý!');
      return res.redirect('/receipt/create');
    }

    if (amount > agency.debt) {
      req.flash('error', 'Số tiền thu lớn hơn số tiền đại lý đang nợ!');
      return res.redirect('/receipt/create');
    }
    // 3. Tạo phiếu thu
    const newReceipt = new Receipt({
      receiptCode: maphieu,
      agencyCode: agency.agencyCode,
      agencyName: agency.name,
      agencyAddress: agency.address,
      agencyPhone: agency.phone,
      agencyEmail: agency.email,
      collectionDate: new Date(),
      amountCollected: amount,
      note: ghichu || ''
    });

    await newReceipt.save();

    // 4. Trừ nợ
    agency.debt = Math.max(agency.debt - amount, 0); // Không cho âm nợ
    await agency.save();

    req.flash('success', 'Lập phiếu thu tiền thành công!');
    return res.redirect('/receipt/create');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Lập phiếu thu tiền thất bại!');
    return res.redirect('/receipt/create');
  }
};