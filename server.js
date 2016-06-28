var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.get('/', function(req, res) {
  res.sendFile(__dirname+'/html/index.html');
});

io.on('connection', function(socket) {
  console.log('A user connected');
});

server.listen(8080, '192.168.187.130', function() {
  console.log('App started at port 8080.');
});
