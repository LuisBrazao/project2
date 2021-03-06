require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session      = require("express-session")
const helpers      = require('handlebars-helpers');


hbs.registerHelper(helpers());



mongoose
  .connect(process.env.MONGODB_URI, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: "my secret",
    cookie: {maxAge: 60000000},
    rolling: true
  })
)

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'Art Auctions';

app.locals.gmapKey = process.env.GOOGLE_MAPS_API_KEY;



const index = require('./routes/index');
app.use('/', index);

const auction = require('./routes/auction/auction');
app.use('/', auction);

const auth = require('./routes/auth/auth');
app.use('/', auth);

const painting = require('./routes/painting/painting');
app.use('/', painting);

const wishlist = require('./routes/wishlist/wishlist');
app.use('/', wishlist);

const store = require('./routes/store/store');
app.use('/', store);

const owned = require('./routes/owned/owned');
app.use('/', owned);

module.exports = app;

