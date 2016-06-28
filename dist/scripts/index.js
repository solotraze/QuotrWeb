var socket = io(); 

$(document).ready(function(){

});

var getQuote = function(stockCode) {
  socket.emit('register_code', stockCode);
};
