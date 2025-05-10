const exphbs = require('express-handlebars');

module.exports = (app) => {
  app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: 'views/layouts/',
    partialsDir: 'views/partials/',
    helpers: {
      eq: (a, b, options) => {
        return a == b ? options.fn(this) : options.inverse(this);
      }
    }
  }));

  app.set('view engine', 'hbs');
  app.set('views', './views');
};