require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');
const exphbs = require('express-handlebars');
// Cấu hình cổng
const port = process.env.PORT || 3000;

// Kết nối MongoDB
const database = require('./configs/database.js');
database.connect();

const userInfoMiddleware = require('./middlewares/user.middleware.js');

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

app.use(flash());
app.use(userInfoMiddleware.infoUser);

// Route chính
app.get('/', (req, res) => {
    res.render('landing_page');
});
// Sử dụng router người dùng
app.use('/page', require('./routes/user.route.js'));
// Sử dụng router chính của Người dùng
app.use('/main', require('./routes/main.route.js'));

// app.use('/page', require('./routes/agency.route.js'));

// Start server
app.listen(port, () => {
    console.log(`Server chạy tại: http://localhost:${port}`);
});
