var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const Cors = require('cors');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(Cors());
app.use(passport.initialize());
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
})
mongoose.connect('mongodb://localhost:27017/mydb', {useNewUrlParser: true}, function(err, database) {
    if (err) throw err;
    db = database;
    console.log("Connected to Mongo");
    });


require('./config/passport')(passport);
var connections = [];
io.on('connection', (socket) => {
  connections.push(socket);
  console.log(`Socket ${socket.id} connected`);
  socket.on('deleteUser', function(data, cb) {
    console.log('deleteUser: ', data);
    socket.broadcast.emit('deleteUser', data);
    cb("456");
  })
  socket.on('changeUser', function(data, cb) {
    console.log('chengeuser: ', data);
    socket.broadcast.emit('changeUser', data);
    cb("123");
  })
  socket.on('addUser', function(data, cb) {
    console.log('addUser: ', data);
    socket.broadcast.emit('addUser', data);
    cb("789");
  })
  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
    connections.splice(connections.indexOf(socket), 1);
  })
})

app.use('/api', require('./routes/index'));

http.listen(3001);


