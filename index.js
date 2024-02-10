require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');

const connectDB = require("./server/config/db");
const expressSession = require('express-session');

var userModel = require("./server/models/User");
const passport = require("passport");

const app = express();

const PORT = process.env.PORT || 8000;

// connect to db

connectDB();

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.use(express.static('public'));

// Templating engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: "fh631j!dbcb746hd66vgg6sfgw6"
}))

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(userModel.serializeUser());
passport.deserializeUser(userModel.deserializeUser());


app.use('/', require('./server/routes/main'));

app.listen(PORT, ()=>{
    console.log(`App listening on port ${PORT}`);
})