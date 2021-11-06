const express = require('express');
const initHandlebars = require('./config/handlebars');
const cookieParser = require('cookie-parser');

const {auth} = require('./middlewares/authMiddleware');

const routes = require('./routes');
const config = require('./config/config.json');
const initDatabase = require('./config/database');

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(auth);

initHandlebars(app);

app.use(express.static('static'));

app.use(routes);


initDatabase(config.DB_CONNECTION_STRING)
    .then(() => {
        app.listen(config.PORT, console.log.bind(console, `App is listening on port http://localhost:${config.PORT}`));
    })
    .catch(err => {
        console.log("Application init failed: ", err);
    });