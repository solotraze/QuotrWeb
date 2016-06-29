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
  <QuoteBox stockCode="ALLBAN" refreshTime="5000" />,
  document.getElementById('divQuoteContent')
);
