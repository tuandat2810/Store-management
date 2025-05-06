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

// Cấu hình view engine Handlebars
app.engine("hbs", exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
}));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

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

// Route chính
app.get('/', (req, res) => {
    res.redirect('/page/login');
});

// Sử dụng router người dùng
app.use('/page', require('./routes/user.route.js'));

// Start server
app.listen(port, () => {
    console.log(`Server chạy tại: http://localhost:${port}`);
});
