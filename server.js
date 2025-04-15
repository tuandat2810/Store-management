require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;


const database = require("./config/database.js");
database.connect();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Chào mừng đến với hệ thống quản lý đại lý!');
});

app.listen(port, () => {
    console.log(`Server chạy tại http://localhost:${port}`);
});
