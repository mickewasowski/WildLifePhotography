const handlebars = require('express-handlebars');
const path = require('path');

const initHandlebars = (app) => {
        app.set('views', path.resolve('./views'));
        app.engine('hbs', handlebars({
            extname: 'hbs'
        }));
        app.set('view engine', 'hbs');
};

module.exports = initHandlebars;