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
password VARCHAR);

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
