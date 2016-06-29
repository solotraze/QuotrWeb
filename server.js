var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var quotr = require('./quotr/quotr');

var socketList = []; 

app.use('/', express.static(__dirname+'/html'));
app.use('/dist', express.static(__dirname+'/dist'));

app.get('/', function(req, res) {
  res.sendFile(__dirname+'/html/index.html');
});

var serveSockets = function() {
  console.log('Number of clients to refresh: ' + socketList.length);

  // Serve the complete batch in one go
  socketList.forEach(function(socketInfo) {
    serveSocket(socketInfo.socket, socketInfo.stockCode);
  });
};

var serveSocket = function (socket, stockCode) {
  if (socket.connected) {
    quotr.getQuote(stockCode, function(err, quote) {
      if (err) {
        console.log('Error in getting quote. Error: '+err);
      }
      else {
        socket.emit('quote', quote);
      }
    });
  }
};
 
io.on('connection', function(socket) {
  console.log('A user connected');

  socket.on('register_code', function(code) {
    var thisSocket = this;
    var socketInfo = { socket: thisSocket, stockCode: code };
    socketList.push(socketInfo);

    console.log('Registered code: ' + code);
    thisSocket.emit('register_code','success');
  });
});

server.listen(8080, '192.168.187.130', function() {
  setInterval(serveSockets, 5000);
  console.log('App started at port 8080.');
});
