var QuoteControlBox = React.createClass({
  getInitialState: function() {
    return { stockCode: '', refreshTime: ''};
  },
  onStockCodeChange: function(e) {
    this.setState ({ stockCode: e.target.value });
  },
  onRefreshTimeChange: function(e) {
    this.setState ({ refreshTime: e.target.value });
  },
  onWatchStock: function(e) {
    e.preventDefault();
    var stockCode = this.state.stockCode.trim();
    if (!stockCode) {
      return;
    }

    // post to server
    //this.props.onWatchStock({stockCode: stockCode });
    getQuote(stockCode);
  },
  onSetRefreshTime: function(e) {
    var refreshTime = this.state.refreshTime.trim();
    if (!refreshTime) {
      return;
    }

    // post to server
    //this.props.onSetRefreshTime({refreshTime: refreshTime });
    setRefreshTime(refreshTime * 1000);
  },
  onClearClients: function(e) {
	clearClients();  
  },
  render: function() {
	return (
	  <div className="quoteBox">
	    <form onSubmit={this.onWatchStock}>
	      <label for="txtStockCode">Code: </label>
          <input type="text" id="txtStockCode" 
            onChange={this.onStockCodeChange} value={this.state.stockCode}/>
          <input type="submit" value="Watch" />
          
          <label for="txtRefreshTime">Refresh Time(s): </label>
          <input type="text" id="txtRefreshTime" 
            onChange={this.onRefreshTimeChange} value={this.state.refreshTime}/>
          <input type="button" value="Set Time" onClick={this.onSetRefreshTime} />
          <input type="button" value="Clear Clients" onClick={this.onClearClients} />
        </form>
      </div>	
	);
  }	
});

var QuoteBox = React.createClass({
  setQuote: function (quote) {
    console.log('--- Quote recieved');
    this.setState(quote);
  },
  wireSocket: function() {
    // If socket connected up in main JS file, wire the event here
    if (socket) {
      socket.on('quote', this.setQuote);
      console.log('Socket wired to React');
    }
    else {
      console.log('Socket not found from React..will retry in 5 seconds')
      setTimeout(this.wireSocket, 5000);
    }
  },
  getInitialState: function () {
    return {
      lastTradedPrice: -1, 
      lastTradeTime: '',
      bestBid: -1,
      bestBidQuantity: -1,
      bestOffer: -1,
      bestOfferQuantity: -1,
      nifty: -1,
      niftyChange: -1,
    };
  },
  componentDidMount: function() {
    this.wireSocket();
  },
  render: function() {
    return (
      <div className="quoteBox">
      <QuoteControlBox />
        <table className="quoteDetails">
          <tbody>
            <tr>
              <th>Last Traded Price</th>
              <td>
                {this.state.lastTradedPrice} 
              </td>
              <th>Time</th>
              <td>
                {this.state.lastTradeTime}
              </td>
            </tr>
            <tr>
              <th>Best Bid</th>
              <td>
                {this.state.bestBid}
              </td>
              <th>Bid Quantity</th>
              <td>
                {this.state.bestBidQuantity}
              </td>
            </tr>
            <tr>
              <th>Best Offer</th>
              <td>
                {this.state.bestOffer}
              </td>
              <th>Offer Quantity</th>
              <td>
                {this.state.bestOfferQuantity}
              </td>
            </tr>
            <tr>
              <th>NIFTY</th>
              <td>
                {this.state.nifty} ({this.state.niftyChange})
              </td>
              <th></th>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
});

ReactDOM.render(
  <QuoteBox />,
  document.getElementById('divQuoteContent')
);
