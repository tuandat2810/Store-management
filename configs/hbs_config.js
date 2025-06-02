const exphbs = require('express-handlebars');

module.exports = (app) => {
  app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: 'views/layouts/',
    partialsDir: 'views/partials/',
    helpers: {
      eq: function (a, b, options) {
        if (a == b) {
          return options.fn(this); // Dùng `this` để giữ nguyên context hiện tại
        } else {
          return options.inverse(this);
        }
      },
      eq1: (a, b) => a === b,
      add: (a, b) => a + b,
      subtract: (a, b) => a - b,
      formatCurrency: (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
      },
      formatDate: (date) => {
        const d = new Date(date);
        return d.toLocaleString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      }
    }
  }));

  app.set('view engine', 'hbs');
  app.set('views', './views');
};