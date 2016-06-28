var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var quotr = require('./quotr/quotr');

app.use('/', express.static(__dirname+'/html'));
app.use('/dist', express.static(__dirname+'/dist'));

app.get('/', function(req, res) {
  res.sendFile(__dirname+'/html/index.html');
});

var curStockCode;
io.on('connection', function(socket) {
  console.log('A user connected');

  socket.on('register_code', function(code) {
    curStockCode = code;
    console.log('Registered code: ' + code);
    io.emit('register_code','success');

    quotr.getQuote(code, function(err, quote) {
      if (err) {
        console.log('Error in getting quote. Error: '+err);
      }
      else {
        io.emit('quote', quote);
      }
    });
  });
});

server.listen(8080, '192.168.187.130', function() {
  console.log('App started at port 8080.');
});
