const model = require('../models/stocks.js')
const loggedInUsers = require('../models/userlist.js')

function CGWatching(req,res)
{
  model.MGWatching(getUserId(req.params.token), res);
}
function CGTrades(req,res)
{
  model.MGTrades(getUserId(req.params.token), res);
}
function CGStock(req,res)
{
  model.MGStock(getUserId(req.params.token),req.params.stockSymbol,res );
}
function CPTrade(req, res)
{
  let userID = getUserId(req.params.token);
  let change = req.body.amount * req.body.cost;
  let symbol = req.params.stockSymbol;
  let amount = req.body.amount;
  let value = req.body.cost;
  model.MPTrade(userID,change,symbol,amount,value, res)
}
function getUserId(token)
{
  return loggedInUsers.filter(x=>x.token == token)[0].userID;
}

module.exports = {CGWatching,CGTrades,CGStock,CPTrade}
