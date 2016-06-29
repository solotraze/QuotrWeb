var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io', { transports: ['websocket']})(server);
var quotr = require('./quotr/quotr');

var bgTask = null;
var socketList = []; 
var refreshTime = 5000;

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
        var minimalQuote = {
          lastTradedPrice: quote.nse.lastTradedPrice,
          lastTradeTime: quote.nse.lastTradeTime,
          bestBid: quote.nse.bestBid,
          bestOffer: quote.nse.bestOffer,
          bestBidQuantity: quote.nse.bestBidQuantity,
          bestOfferQuantity: quote.nse.bestOfferQuantity,
          nifty: quote.nifty,
          niftyChange: quote.niftyChange,
        };

        socket.emit('quote', minimalQuote);
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

  socket.on('set_refresh_time', function(ms) {
    try {
      console.log('Setting refresh time to: ' + ms.toString() + ' milliseconds');
      refreshTime = parseInt(ms);

      if (bgTask) { clearInterval(bgTask); }
      bgTask = setInterval(serveSockets, refreshTime);
    }
    catch(err) { console.log('Error: Failed to set refresh time.'); }
  });

  socket.on('clear_clients', function () {
    socketList = [];
    console.log('Cleared all  stock listening requests');
  });
});

//  Set the environment variables we need.
var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
var port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

if (typeof ipaddress === "undefined") {
  //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
  //  allows us to run/test the app locally.
  console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
  ipaddress = "127.0.0.1";
  //ipaddress = "192.168.187.130";
};
        
        
server.listen(port, ipaddress, function() {
  bgTask = setInterval(serveSockets, refreshTime);
  console.log('App started at: http://' + ipaddress + ':' + port);
});
