const express = require('express');
const app = express();
const ctrl = require('../controller/stocks.js')


//return all stock symbols that this user is watching
app.get('/:token/watching',ctrl.CGWatching);
//get all trades by a specific user
app.get('/:token/trades', ctrl.CGTrades);
//get the specific users trades for this stock
app.get('/:token/:stockSymbol',ctrl.CGStock)

app.post('/:token/:stockSymbol/trade',ctrl.CPTrade)
module.exports = app;
