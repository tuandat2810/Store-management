require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const exphbs = require('express-handlebars');

const District = require('./models/district.m.js'); // Import model District
const Agency = require('./models/agency.m.js'); // Import model Agency

// Cấu hình public folder
app.use(express.static(path.join(__dirname, 'public')));

// Cấu hình cổng
const port = process.env.PORT || 3000;

// Kết nối MongoDB
const database = require('./configs/database.js');
const { infoUser } = require('./middlewares/user.middleware.js');
database.connect();

// Cấu hình view engine Handlebars
require('./configs/hbs_config')(app);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Cấu hình session & flash
app.use(session({
    secret: 'LLLLLLLLLLL',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

// Flash
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success');
    res.locals.error_msg = req.flash('error');
    next();
});

// Route chính
app.get('/', async (req, res) => {
    try {
        const agencies = await Agency.find({status:"Đã duyệt"},'district');
        const districtIdsWithAgencies = [...new Set(agencies.map(a => a.district))];
        const districts = await District.find({ id: { $in: districtIdsWithAgencies } });
        const totalDistricts = districts.length;
        const totalAgencies = agencies.length;

        res.render('landing_page', {
            districts,
            totalDistricts,
            totalAgencies
        });

    } catch (err) {
        console.error('Lỗi khi lấy quận có đại lý:', err);
        res.status(500).send('Lỗi server');
    }
});
app.use(infoUser)
// Sử dụng router người dùng
app.use('/user', require('./routes/user.route.js'));
// Sử dụng router chính của Người dùng
app.use('/main', require('./routes/main.route.js'));


app.use('/agency', require('./routes/agency.route.js'));
app.use('/policy', require('./routes/policy.route.js'));
app.use('/product', require('./routes/product.route.js'));
app.use('/order', require('./routes/order.route.js'));
app.use('/receipt', require('./routes/receipt.route.js'));

// Mọi trang khác sẽ được chuyển hướng đến trang 404
app.use('*', (req, res) => {
    res.status(404).render('404', {
        layout: 'error',
        title: 'Trang không tìm thấy'
    });
});


// Start server
app.listen(port, () => {
    console.log(`Server chạy tại: http://localhost:${port}`);
});


