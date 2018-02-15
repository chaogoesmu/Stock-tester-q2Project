const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');

const env = 'development';
const config = require('./knexfile')[env];
const knex = require('knex')(config);

app.disable('x-powered-by');

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(bodyParser.json());

app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*");
   res.header('Access-Control-Allow-Methods', 'DELETE, PUT');
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }});

let loggedInUsers=[{userID:1,token:0}];

//******* ROUTES *******//

//TODO: have a way to get the username?  Do I even care about this or should it be set based on the data we receive.
//TODO: get funds available...



app.post('/login', (req,res)=>{
  //if login works
  un = req.body.username;
  pw = req.body.password;
  knex('users')
  .select('id')
  .where({username: un, password: pw})
  .then(results=>{
    if(results.length>0)
    {
      uuOut = uuid();
      loggedInUsers.push({userID:results[0].id,token:uuOut});
      return res.status(200).send(uuOut)
    }
    res.status(401).send('Access Denied')
  });
})
app.post('/newUser', (req,res)=>{
  //TODO: add a new user
})
app.get('/:token/funds',(req,res)=>{
  let userID = getUserId(req.params.token);
  knex('users')
  .select('funds')
  .where({id:userID})
  .then(results=>{
    return res.status(200).send(results[0].funds+'');//this bug in send annoys me greatly
  })
})
app.get('/:token/',(req,res)=>{
  let userID = getUserId(req.params.token);
  //TODO:return all the stock trades of a specific user
  //TODO:also return all stock scores that this user is watching
});
app.get('/:token/watching',(req,res)=>{
  let userID = getUserId(req.params.token);
  //return all stock symbols that this user is watching
  knex('watchedsymbol')
  .where('uid',userID)
  .then(results=>{
    res.status(200).send(results);
  })
});
app.get('/:token/trades',(req,res)=>{
  let userID = getUserId(req.params.token);
  //return all the stock trades of a specific user
  knex('trades')
  .where('uid',userID)
  .then(results=>{
    res.status(200).send(results);
  })
});

app.get('/:token/:stockSymbol',(req,res)=>{
  let userID = getUserId(req.params.token);
  //return all the stock scores of this user for this specific stockSymbol
  knex('trades')
  .where({uid:userID,symbol:stockSymbol})
  .then(results=>{
    res.status(200).send(results);
  })
})
app.post('/:token/:stockSymbol/trade',(req,res)=>{
  let userID = getUserId(req.params.token);
  //TODO: this should really pull from the API and not the users browser, leaves this way open to hacking, fix before public release.
  //TODO TODO TODO TODO TODO TODO TODO TODO: seriously.  do this.
  let change = req.body.amount * req.body.cost;
  console.log('change');
  console.log(change);
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
        symbol:req.params.stockSymbol,
        amount:req.body.amount,
        value:req.body.cost
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
})

app.get('/:token/logOff',(req,res)=>{
  loggedInUsers.splice(loggedInUsers.findIndex(x=> x.token==token),1);
  //remove this user from the loggedInUsers array
})

//******* HELPER FUNCTIONS *******//

function getUserId(token)
{
  return loggedInUsers.filter(x=>x.token == token)[0].userID;
}



if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`listening on: ${port}!`)
  })
}
/*
CREATE TABLE users(
id SERIAL PRIMARY KEY,
username VARCHAR,
password VARCHAR,
funds FLOAT
);

CREATE TABLE trades(
id SERIAL PRIMARY KEY,
uid int references users(id),
symbol VARCHAR,
tradeTime TIMESTAMP,
value FLOAT,
amount INT
);

CREATE TABLE watchedSymbol(
id SERIAL PRIMARY KEY,
uid int references users(id),
symbol VARCHAR
);
*/

module.exports = app
