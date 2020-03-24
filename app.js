const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.mongoose_url, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', (err) => console.log(err));

db.once('open', () => console.log('Connected'));

const indexRouter = require('./routes/index');
const updateRouter = require('./routes/update');


const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('views', './views')
app.set('view engine', 'ejs');

app.use('/countries', indexRouter);

app.use('/update', updateRouter);

module.exports = app;
