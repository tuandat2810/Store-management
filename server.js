require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

require('./configs/hbs_config.js')(app);

// MongoDB
const database = require("./configs/database.js");
database.connect();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.redirect('/page/login');
})
app.use('/page', require('./routes/page.r.js'));

app.listen(port, () => {
    console.log(`Server chạy tại http://localhost:${port}`);
});
