var request = require('request');
var cheerio = require('cheerio');
var quoteUrl = 'http://getquote.icicidirect.com/trading_stock_quote.aspx?symbol='

var processAttribute = function ($, attribute) {
  // TODO: contains seems not correct. use something ==
  var nseElement = $("td:contains("+ attribute.caption+ ")").next();
  var nseText = (nseElement.text().trim());
  var bseText = (nseElement.next().text().trim());
  var nseVal = attribute.type === 'number' ? parseFloat(nseText.replace(/[,]/g,'')) : nseText;
  var bseVal = attribute.type === 'number' ? parseFloat(bseText.replace(/[,]/g,'')) : bseText;

  var attributeValues = { nseVal: nseVal, bseVal: bseVal };
  return attributeValues;
}

var parseResponse = function (html) {
  var $ = cheerio.load(html);
  var quoteObj = { nse: { }, bse: { } };

  var attributeMapping = [
    {key:'lastTradeDate',caption:'DATE',type:'date'},
    {key:'lastTradeTime',caption:'LAST TRADED TIME',type:'time'},
    {key:'lastTradedPrice',caption:'LAST TRADE PRICE',type:'number'},
    {key:'bestBid',caption:'BEST BID PRICE',type:'number'},
    {key:'bestBidQuantity',caption:'BEST BID QTY',type:'number'},
    {key:'bestOffer',caption:'BEST OFFER PRICE',type:'number'},
    {key:'bestOfferQuantity',caption:'BEST OFFER QTY',type:'number'},
    //stats:
    {key:'dayOpen',caption:'DAY OPEN',type:'number'},
    {key:'dayClose',caption:'* DAY CLOSE',type:'number'},
    {key:'closeLastDay',caption:'PREVIOUS DAY CLOSE',type:'number'},
    {key:'dayChange',caption:'CHANGE',type:'number'},
    {key:'dayChangePercentage',caption:'% CHANGE',type:'number'},
    {key:'dayHigh',caption:'DAY HIGH',type:'number'},
    {key:'dayLow',caption:'DAY LOW',type:'number'},
    {key:'yearHigh',caption:'52 WEEK HIGH',type:'number'},
    {key:'yearLow',caption:'52 WEEK LOW',type:'number'},
    {key:'lifeHigh',caption:'LIFE TIME HIGH',type:'number'},
    {key:'lifeLow',caption:'LIFE TIME LOW',type:'number'},
    {key:'dayVolume',caption:'DAY VOLUME',type:'number'},
  ];
  $(attributeMapping).each(function (index, attribute) {
    var valObj = processAttribute($, attribute);
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
