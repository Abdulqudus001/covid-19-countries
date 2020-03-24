const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const socketIO = require('socket.io');
require('dotenv').config();

const Country = require('./model/countries');

mongoose.connect(process.env.mongoose_url, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', (err) => console.log(err));

db.once('open', () => console.log('Connected'));

const indexRouter = require('./routes/index');
const updateRouter = require('./routes/update');

const app = express();

const io = socketIO();
app.io = io;

const changeStream = Country.watch();
io.on("connection", function (socket) {
  socket.emit('connection', "WS Connected successfully");
  changeStream.on('change', (change) => {
    const countries = Country.find({}, (err, data) => {
      if (err) {
        res.status(500).json({ message: "Something went wrong" });
      } else {
        const sortedData = data.sort((a, b) => a.name - b.name);
        socket.emit('countries', sortedData);
      }
    });
  })
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.set('views', './views')
app.set('view engine', 'ejs');

app.use('/countries', indexRouter);

app.use('/update', updateRouter);

module.exports = app;
