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
          return options.fn(options.data.root); 
        } else {
          return options.inverse(options.data.root);
        }
      },
      eq1: (a, b) => a === b,
      add: (a, b) => a + b,
      subtract: (a, b) => a - b
    }
  }));

  app.set('view engine', 'hbs');
  app.set('views', './views');
};