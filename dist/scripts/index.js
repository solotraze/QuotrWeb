var socket; 

$(document).ready(function(){
  socket = io(); 
  socket.on('register_code', function(msg) {
    console.log('Code registered');
  });
  socket.on('quote', function(quote) {
    console.log(quote);
  });
});

var getQuote = function(stockCode) {
  if (socket) {
    socket.emit('register_code', stockCode);
  }
};
