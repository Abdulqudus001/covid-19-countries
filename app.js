var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.mongoose_url, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', (err) => console.log(err));

db.once('open', () => console.log('Connected'));

var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/countries', indexRouter);

module.exports = app;
