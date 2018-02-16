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
let users = require('./routes/user.js');
let stocks = require('./routes/stocks.js');
app.use('',users );
app.use('',stocks );

//const ctrl = require('../controller/stocks.js')


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
