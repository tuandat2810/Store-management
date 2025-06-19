const generateRandom = require('../helpers/generateRandom');
const Agency = require('../models/agency.m.js');
const Product = require('../models/product.m.js');
const Order = require('../models/order.m.js');
const AgencyType = require('../models/agencytype.m.js');
const Receipt = require('../models/receipt.m.js');
const District = require('../models/district.m.js');
const User = require('../models/user.m.js');
const ProductUnit = require('../models/productunit.m.js');



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
    const userType = res.locals.user.type;

    // Lấy danh sách quận từ District model
    const districts = await District.find().lean(); 

    // Lấy tháng, năm, quận từ body hoặc mặc định
    const selectedMonth = parseInt(req.body.thang) || new Date().getMonth() + 1;
    const selectedYear = parseInt(req.body.nam) || new Date().getFullYear();
    const selectedDistrict = req.body.district || '';

    // Lấy ngày bắt đầu và kết thúc trong tháng
    const fromDate = new Date(selectedYear, selectedMonth - 1, 1);
    // console.log('fromDate: ', fromDate);
    const toDate = new Date(selectedYear, selectedMonth, 1);
    // console.log('toDate: ', toDate);

    // Lọc agency theo quận (nếu có)
    let agencyFilter = { status: 'Đã duyệt' };
    if (userType === 'user') {
      // Nếu là user (đại lý), chỉ lấy các đại lý do họ quản lý
      agencyFilter.managerUsername = res.locals.user.fullname;
    }
    if (selectedDistrict) {
      agencyFilter.district = selectedDistrict;
    }

    const agencies = await Agency.find(agencyFilter).lean();

    // Map từ agencyCode => agencyName
    const agencyMap = {};
    agencies.forEach(a => agencyMap[a.agencyCode] = a.name);
    // console.log('agencyMap: ', agencyMap);
    const agencyCodes = agencies.map(a => a.agencyCode);
    // console.log('agencyCodes: ', agencyCodes);

    // Lấy tất cả đơn hàng trong tháng
    const orders = await Order.find({
      agencyCode: { $in: agencyCodes },
      orderDate: { $gte: fromDate, $lt: toDate }
    }).lean();

    // console.log('orders: ', orders);

    // Tính tổng doanh số và số phiếu xuất theo đại lý
    const salesSummary = {};
    for (const order of orders) {
      const code = order.agencyCode; // Lấy mã đại lý từ đơn hàng
      if (!salesSummary[code]) { // Nếu chưa có đại lý này trong báo cáo
        // Khởi tạo đối tượng cho đại lý này
        salesSummary[code] = { numOrders: 0, totalSales: 0 };
      }
      salesSummary[code].numOrders += 1; // Tăng số phiếu xuất hàng
      salesSummary[code].totalSales += order.totalAmount;  // Cộng dồn doanh số
    }

    // Tổng doanh số toàn bộ (để tính phần trăm tỷ lệ)
    const totalSalesAll = Object.values(salesSummary).reduce((sum, a) => sum + a.totalSales, 0); 

    // Tạo mảng báo cáo doanh thu (BM5.1)
    const salesReport = Object.entries(salesSummary).map(([code, data]) => ({
      agencyName: agencyMap[code] || code,
      numOrders: data.numOrders,
      totalSales: parseFloat(data.totalSales.toFixed(2)),
      percentage: totalSalesAll > 0 ? (data.totalSales / totalSalesAll * 100).toFixed(2) : '0.00'
    }));

    // Lấy tất cả phiếu thu trong tháng
    const receipts = await Receipt.find({
      agencyCode: { $in: agencyCodes },
      collectionDate: { $gte: fromDate, $lt: toDate }
    }).lean();

    // Tính phát sinh thu tiền theo đại lý
    const receiptMap = {};
    for (const r of receipts) {
      const code = r.agencyCode; // Lấy mã đại lý từ phiếu thu
      if (!receiptMap[code]) receiptMap[code] = 0; // Nếu chưa có đại lý này trong báo cáo, khởi tạo
      receiptMap[code] += r.amountCollected; // Cộng dồn số tiền thu
    }

    // Tạo báo cáo công nợ (BM5.2)
    const debtReport = agencies.map(agency => {
      const code = agency.agencyCode; 
      const incurred = salesSummary[code]?.totalSales || 0;
      const collected = receiptMap[code] || 0;
      const openingDebt = Math.max((agency.debt || 0) - incurred + collected, 0); // gần đúng
      const closingDebt = agency.debt;

      return {
        agencyName: agency.name,
        openingDebt: parseFloat(openingDebt.toFixed(2)),
        incurred: parseFloat(incurred.toFixed(2)),
        closingDebt: parseFloat(closingDebt.toFixed(2))
      };
    });
    
    const data = { districts,
      salesReport, debtReport,
      selectedMonth, selectedYear, selectedDistrict,
      months: [1,2,3,4,5,6,7,8,9,10,11,12], years: [2024, 2025]
    };

    res.render('bao_cao_hang_thang', {
      layout: 'main',
      title: 'Báo cáo hàng tháng',
      ...data
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};



module.exports.load_lap_phieu_thu_tien = async (req, res) => {
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

module.exports.load_xem_phieu_thu_tien = async (req, res) => {
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



module.exports.lap_phieu_thu_tienPOST = async (req, res) => {
  try {
    const { maphieu, agencyCode, sotien, ghichu } = req.body;

    // 1. Kiểm tra dữ liệu bắt buộc
    if (!maphieu || !agencyCode || !sotien) {
      req.flash('error', 'Thiếu thông tin bắt buộc!');
      return res.redirect('/main/lap_phieu_thu_tien');
    }

    const amount = parseFloat(sotien);
    if (isNaN(amount) || amount <= 0) {
      req.flash('error', 'Số tiền không hợp lệ!');
      return res.redirect('/main/lap_phieu_thu_tien');
    }

    // 2. Tìm đại lý
    const agency = await Agency.findOne({ agencyCode });
    if (!agency) {
      req.flash('error', 'Không tìm thấy đại lý!');
      return res.redirect('/main/lap_phieu_thu_tien');
    }

    if (amount > agency.debt) {
      req.flash('error', 'Số tiền thu lớn hơn số tiền đại lý đang nợ!');
      return res.redirect('/main/lap_phieu_thu_tien');
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
    return res.redirect('/main/lap_phieu_thu_tien');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Lập phiếu thu tiền thất bại!');
    return res.redirect('/main/lap_phieu_thu_tien');
  }
};

