const loggedInUsers = require('./userlist.js')
const env = 'development';
const config = require('../knexfile')[env];
const knex = require('knex')(config);

function MGWatching(userID, res)
{
  knex('watchedsymbol')
  .where('uid',userID)
  .then(results=>{
    res.status(200).send(results);
  })
}
function MGTrades(userID, res)
{
  knex('trades')
  .where('uid',userID)
  .then(results=>{
    res.status(200).send(results);
  })
}
function MGStock(userID, stockSymbol, res)
{
  knex('trades')
  .where({uid:userID,symbol:stockSymbol})
  .then(results=>{
    res.status(200).send(results);
  })
}

function MPTrade(userID,change,_symbol,_amount,_value, res)
{
  knex('users')
  .select('funds')
  .where({id:userID})
  .first()
  .then(result=>{
    console.log('result');
    console.log(result);
    if(result.funds-change>0)
    {

      amtToMod = result.funds;
      knex('trades')
      .insert({
        uid:userID,
        symbol:_symbol,
        amount:_amount,
        value:_value
        //,tradeTime:'NOW()'
      })
      .then(results=>{
        console.log('change')
        console.log(change)
        knex('users')
        .first()
        .where({id:userID})
        .update({funds:result.funds-change})
        .then(results=>{
          res.status(200).send(results+'');
        })

      })
    }
    else {
      return res.status(401).send('insufficient funds');
    }
  })
}

module.exports = { MPTrade, MGStock, MGTrades, MGWatching }
