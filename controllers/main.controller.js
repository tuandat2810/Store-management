const generateRandom = require('../helpers/generateRandom');
const Agency = require('../models/agency.m.js');
const Product = require('../models/product.m.js');
const Order = require('../models/order.m.js');
const AgencyType = require('../models/agencytype.m.js');
const Receipt = require('../models/receipt.m.js');
const District = require('../models/district.m.js');
const User = require('../models/user.m.js');
const ProductUnit = require('../models/productunit.m.js');


module.exports.load_dang_ki_dai_ly = async (req, res) => {
  const agencyCode = await generateRandom.generateUniqueAgencyCode();
  const agencyTypes = await AgencyType.find().lean();
  const districts = await District.find().lean();
  const data = { agencyCode, agencyTypes, districts };

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

module.exports.load_lap_phieu_xuat_hang = async (req, res) => {
  try {
    const orderCode = await generateRandom.generateUniqueOrderCode();
    
    const products = await Product.find().lean();
    // console.log(products);
    const agencies = await Agency.find({
      $and: [
        { managerUsername: res.locals.user.fullname },
        { status: "Đã duyệt" },
      ],
    }).lean();

    // console.log('Agencies: ', agencies);

    const data = { orderCode, products, agencies };

    res.render('lap_phieu_xuat_hang', {
      layout: 'main',
      title: 'Lập phiếu xuất hàng',
      ...data
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};

module.exports.load_xem_phieu_xuat_hang = async (req, res) => {
  try {
    const userType = res.locals.user.type;
    const fullname = res.locals.user.fullname;

    let orders;

    if (userType === 'user') {
      orders = await Order.find({ createdBy: fullname }).sort({ orderDate: -1 }).lean();
    } else {
      orders = await Order.find().sort({ orderDate: -1 }).lean();
    }

    const data = { orders };
    
    res.render('xem_phieu_xuat_hang', {
      layout: 'main',
      title: 'Xem phiếu xuất hàng',
      ...data
    });
  } catch (err) {
    console.error(err);
    res.status(500).render('500', { layout: false });
  }
};


module.exports.load_thay_doi_quy_dinh = async (req, res) => {
  try {
    const districts = await District.find().lean();
    const agencyTypes = await AgencyType.find().lean();

    const products = await Product.find().lean();
    
    const productUnits = await ProductUnit.find().lean();

    const data = { districts, agencyTypes, products, productUnits };

    res.render('thay_doi_quy_dinh', {
      layout: 'main',
      title: 'Thay đổi quy định',
      ...data
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

      req.flash("success", "Đăng ký đại lý thành công. Vui lòng chờ duyệt!");
      return res.redirect("/main/dang_ki_dai_ly");

    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      req.flash("error", "Lỗi hệ thống khi đăng ký đại lý!");
      return res.redirect("/main/dang_ki_dai_ly");
    }
};

module.exports.lap_phieu_xuat_hangPOST = async (req, res) => {
  try {
    // 1. Lấy dữ liệu từ form
    const { orderCode, agencyCode, cartData } = req.body;

    // 2. Kiểm tra bắt buộc
    if (!orderCode || !agencyCode || !cartData) {
      // Thiếu dữ liệu, trả về lỗi hoặc redirect về form với flash message
      return res.status(400).send('Thiếu thông tin cần thiết.');
    }

    // 3. Parse cartData (là JSON-string) thành mảng JS
    let productsArray;
    try {
      productsArray = JSON.parse(cartData);
    } catch (parseErr) {
      return res.status(400).send('Dữ liệu giỏ hàng không hợp lệ.');
    }

    if (!Array.isArray(productsArray) || productsArray.length === 0) {
      return res.status(400).send('Giỏ hàng rỗng hoặc không đúng định dạng.');
    }

    // 4. Chuẩn hóa lại mảng products: 

    const processedProducts = productsArray.map(item => {
      const productCode = item.productCode; 
      const productName = item.productName;
      const unitPrice = parseFloat(item.unitPrice);
      const unit = item.unit;
      const quantity = parseInt(item.qty, 10);
      const totalPrice = unitPrice * quantity;

      return { productCode, productName, unitPrice, unit, quantity, totalPrice };
    });

    // 5. Tính tổng toàn bộ
    const totalAmount = processedProducts.reduce((sum, p) => sum + p.totalPrice, 0);

    // Bước kiểm tra: tổng nợ mới có vượt maximumDebt không?
    const agency = await Agency.findOne({ agencyCode });

    if (!agency) {
      req.flash("error", "Không tìm thấy đại lý.");
      return res.redirect('/main/lap_phieu_xuat_hang');
    }

    // Lấy maximumDebt từ loại đại lý
    const agencyType = await AgencyType.findOne({ type: agency.type });

    if (!agencyType) {
      req.flash("error", "Không tìm thấy thông tin loại đại lý.");
      return res.redirect('/main/lap_phieu_xuat_hang');
    }

    const newDebt = agency.debt + totalAmount;
    const maximumDebt = agencyType.maximumDebt;

    if (newDebt > maximumDebt) {
      req.flash("error", `Không thể lập phiếu. Tổng nợ (${newDebt}) vượt mức cho phép (${maximumDebt}).`);
      return res.redirect('/main/lap_phieu_xuat_hang');
    }

    // 6. Tạo một instance mới của Order
    const newOrder = new Order({
      orderCode,
      agencyCode,
      createdBy: res.locals.user.fullname,
      // orderDate: Mongoose tự default Date.now nếu ko truyền
      products: processedProducts,
      totalAmount
    });

    // 7. Lưu vào DB
    await newOrder.save();
    
    // Cập nhật nợ của đại lý
    agency.debt = newDebt;
    await agency.save();

    req.flash("success", "Lập phiếu xuất hàng thành công!");
    return res.redirect('/main/lap_phieu_xuat_hang'); 

  } catch (err) {
    // Nếu lỗi duplicate orderCode hoặc lỗi khác
    if (err.code === 11000 && err.keyPattern && err.keyPattern.orderCode) {
      req.flash("error", "Lập phiếu xuất hàng thất bại (trùng phiếu xuất hàng)!");
    } else
      req.flash("error", "Lập phiếu xuất hàng thất bại!");
  }
}

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

