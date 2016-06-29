var socket; 

$(document).ready(function(){
  // OpenShift exposes websockets on a specific port. So use that.
  //socket = io(); 
  socket = io.connect('http://quotrweb-littlestory.rhcloud.com:8000', {'forceNew':true}); 

  socket.on('register_code', function(msg) {
    console.log('Code registered');
  });
  // Following will be done from react ready event in index_react.js
  /*
  socket.on('quote', function(quote) {
    console.log(quote);
  });
  */
});

var getQuote = function(stockCode) {
  if (socket) {
    socket.emit('register_code', stockCode);
  }
};

var setRefreshTime = function(ms) {
  if (socket) {
    socket.emit('set_refresh_time', ms);
  }
};

var clearClients = function() {
  if (socket) {
    socket.emit('clear_clients', '');
  }
};
