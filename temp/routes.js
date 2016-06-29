var fs      = require('fs');
//var constants = require('./constants.js');
var readful= require('./readful');
var logger = require('./logger');

var zcache, cache_get;
/* routing table entries */
var routes = { };

/**
 *  Create the routing table entries + handlers for the application.
 */

/**
 *  Populate the cache.
 */
populateCache = function() {
    if (typeof zcache === "undefined") {
      zcache = { 'index.html': '' };
    }

    //  Local cache for static content.
    zcache['index.html'] = fs.readFileSync('./index.html');
};


/**
 *  Retrieve entry (content) from cache.
 *  @param {string} key  Key identifying content to retrieve from cache.
 */
cache_get = function(key) { return zcache[key]; };

/********************************/
/* Pages						*/
/********************************/
/* Home page */
routes['/'] = function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.send(cache_get('index.html') );
};

/********************************/
/* REST Services				*/
/********************************/

/* Read a url and return text */
routes['/api/readful'] = function(req, res) {
  var url = req.query.targeturl;//decodeURIComponent(req.query.targeturl);
  //console.log('Request recieved for URL: ' + url);

  readful.readBare(url, function(htmlText) {
    if (htmlText == undefined) { htmlText = ''; };
    res.setHeader('Content-Type', 'text/plain');
    res.send(htmlText);
  });
};

/* Read JSON list of the failed URLs */
routes['/api/logs/failedurls'] = function(req, res) {
  logger.readFailedUrls(function(data) {
    res.setHeader('Content-Type', 'application/json');
    res.send(data);
  });
};

/********************************/
/* Test Urls					*/
/********************************/
routes['/robo'] = function(req, res) {
    var link = "http://i.imgur.com/kmbjB.png";
    res.send("<html><body>hello robo<img src='" + link + "'></body></html>");
};

/* Public properties */
exports.list = routes;
exports.populateCache = populateCache;
