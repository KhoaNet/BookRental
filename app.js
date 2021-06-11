require('dotenv').config()
var path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const app = express()
const port = process.env.PORT;

// Passport Config
require('./config/passport')(passport);


// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
  );
  
  // Passport middleware
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Connect flash
  app.use(flash());
  
  // Global variables
  app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
  });


app.set("view engine","jade");
app.set('views',  __dirname + '/views');
app.set('layout', 'layout');
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({  extended: false }))
app.use(bodyParser.json());

app.locals._      = require('underscore');
app.locals._.str  = require('underscore.string');
app.locals.moment = require('moment');

const mongoose = require('mongoose')
mongoose.connect(process.env.DB_MONGO_URL, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected Mongodb'))

app.use('/', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
app.use('/books', require('./routes/books'));
app.use('/geners', require('./routes/geners'));
app.use('/users', require('./routes/users'));

app.listen(port, () => console.log(`Example app listening on port :${port}!`))