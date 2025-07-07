const generateRandom = require('../helpers/generateRandom');
const Agency = require('../models/agency.m.js');
const Product = require('../models/product.m.js');
const Order = require('../models/order.m.js');
const AgencyType = require('../models/agencytype.m.js');

module.exports.viewCreatedFormOrder = async (req, res) => {
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

module.exports.viewAllOrders = async (req, res) => {
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



module.exports.createOrder = async (req, res) => {
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
      console.log('1')
      return res.redirect('/order/create');
    }

    // Lấy maximumDebt từ loại đại lý
    const agencyType = await AgencyType.findOne({ type: agency.type });

    if (!agencyType) {
      req.flash("error", "Không tìm thấy thông tin loại đại lý.");
      console.log('2')
      return res.redirect('/order/create');
    }

    const newDebt = agency.debt + totalAmount;
    const maximumDebt = agencyType.maximumDebt;

    if (newDebt > maximumDebt) {
      req.flash("error", `Không thể lập phiếu. Tổng nợ ${newDebt} vượt mức cho phép ${maximumDebt}.`);
      console.log('3')
      return res.redirect('/order/create');
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
    return res.redirect('/order/create'); 

  } catch (err) {
    // Nếu lỗi duplicate orderCode hoặc lỗi khác
    if (err.code === 11000 && err.keyPattern && err.keyPattern.orderCode) {
      req.flash("error", "Lập phiếu xuất hàng thất bại (trùng phiếu xuất hàng)!");
    } else
      req.flash("error", "Lập phiếu xuất hàng thất bại!");
  }
};