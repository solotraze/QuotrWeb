var request = require('request');
var cheerio = require('cheerio');
var quoteUrl = 'http://getquote.icicidirect.com/trading_stock_quote.aspx?symbol='

var processAttribute = function ($, caption) {
  // TODO: contains seems not correct. use something ==
  var nseElement = $("td:contains("+caption+")").next();
  var nseVal = parseFloat(nseElement.text().trim());
  var bseVal = parseFloat(nseElement.next().text().trim());

  var attributeValues = { nseVal: nseVal, bseVal: bseVal };
  return attributeValues;
}

var parseResponse = function (html) {
  var $ = cheerio.load(html);
  var quoteObj = { nse: { }, bse: { } };

  var attributeMapping = [
    {key:'lastTradeDate',caption:'DATE'},
    {key:'lastTradeTime',caption:'LAST TRADED TIME'},
    {key:'lastTradedPrice',caption:'LAST TRADE PRICE'},
    {key:'bestBid',caption:'BEST BID PRICE'},
    {key:'bestBidQuantity',caption:'BEST BID QTY'},
    {key:'bestOffer',caption:'BEST OFFER PRICE'},
    {key:'bestOfferQuantity',caption:'BEST OFFER QTY'},
    //stats:
    {key:'dayOpen',caption:'DAY OPEN'},
    {key:'dayClose',caption:'* DAY CLOSE'},
    {key:'closeLastDay',caption:'PREVIOUS DAY CLOSE'},
    {key:'dayChange',caption:'CHANGE'},
    {key:'dayChangePercentage',caption:'% CHANGE'},
    {key:'dayHigh',caption:'DAY HIGH'},
    {key:'dayLow',caption:'DAY LOW'},
    {key:'yearHigh',caption:'52 WEEK HIGH'},
    {key:'yearLow',caption:'52 WEEK LOW'},
    {key:'lifeHigh',caption:'LIFE TIME HIGH'},
    {key:'lifeLow',caption:'LIFE TIME LOW'},
    {key:'dayVolume',caption:'DAY VOLUME'},
  ];
  $(attributeMapping).each(function (index, attribute) {
    var valObj = processAttribute($, attribute.caption);
    quoteObj.nse[attribute.key] = valObj.nseVal;
    quoteObj.bse[attribute.key] = valObj.bseVal;
  });

  var niftyCell = $("a:contains('NIFTY')");
  var sensexCell = $("a:contains('SENSEX')");
  var niftyCellText = niftyCell.parent().text();
  var sensexCellText = sensexCell.parent().text();
  quoteObj.nifty = parseFloat(niftyCellText.split('\r\n')[1].replace(/[\t(),]/g,''));
  quoteObj.niftyChange = parseFloat(niftyCell.next().text().replace(/[\t(),\r\n]/g,''));
  quoteObj.sensex = parseFloat(sensexCellText.split('\r\n')[1].replace(/[\t(),]/g,''));
  quoteObj.sensexChange = parseFloat(sensexCell.next().text().replace(/[\t(),\r\n]/g,''));

  return quoteObj;
};

var getQuote = function (stockCode, callback) {
  var askedQuoteUrl = quoteUrl+stockCode;
  console.log('Sending web request to: ' + askedQuoteUrl);
  request(askedQuoteUrl, function(err, response, html) {
    console.log('Ended web request');
    try {
      if(!err){
        console.log('Web request succeeded');
        var quoteObj = parseResponse(html);
        // Return data
        callback(null, quoteObj);
      }
      else {
        console.log('Web request failed');
        callback(err);
      }
    }
    catch(ex) {
      console.log('Web response parsing failed');
      callback(ex);
    }
  });
};





/*
Expected stock quote structure:
{
    stockName: <str>,
    stockCode: <str>,
    accessDateTime: <datetime>,

    sensex: <num>,
    sensexChange: <num>,

    nifty: <num>,
    niftyChange: <num>,

    nse: {
      lastTradeDate: <date>,
      lastTradeTime: <time>,
      lastTradedPrice: <num>,

      bestBid: <num>,
      bestBidQuantity: <int>,

      bestOffer: <num>,
      bestOfferQuantity: <int>,

      //stats:
      dayOpen: <num>,
      dayClose: <num>,
      closeLastDay: <num>,

      dayChange: <num>,
      dayChangePercentage: <num>,

      dayHigh: <num>,
      dayLow: <num>,
      yearHigh: <num>,
      yearLow: <num>,
      lifeHigh: <num>,
      lifeLow: <num>,

      dayVolume: <int>

    },
    bse: {...}
    }
*/

exports.getQuote = getQuote;
