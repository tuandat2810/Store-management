const exphbs = require('express-handlebars');

module.exports = (app) => {
  app.engine('hbs', exphbs.engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: 'views/layouts/',
    partialsDir: 'views/partials/',
  }));

  app.set('view engine', 'hbs');
  app.set('views', './views');
};