var quotr_ic = require('./quotr_ic');

var getQuote = function (stockCode, callback) {
  quotr_ic.getQuote(stockCode, function(err, data) {
    if(err) { callback(err); return; }
    callback(null, data);
  });
};

exports.getQuote = getQuote;
