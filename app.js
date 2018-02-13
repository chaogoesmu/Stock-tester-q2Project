const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const uuid = require('uuid/v4');

app.disable('x-powered-by');

if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

app.use(bodyParser.json());

let loggedInUsers=[];

app.post('/login', (req,res)=>{
  //if login works
  loggedInUsers.push({userID:'id',token:'token'})
  //TODO: return the token somehow?
})
app.get('/:token/',(req,res)=>{
  //TODO:return all the stock trades of a specific user
  //TODO:also return all stock scores that this user is watching
});
app.get('/:token/symbols',(req,res)=>{
  // TODO: return all stock symbols that this user is watching
});
app.get('/:token/trades',(req,res)=>{
  //TODO:return all the stock trades of a specific user
});
app.get('/:token/stockSymbol',(req,res)=>{
  //TODO:return all the stock scores of this user for this specific stockSymbol
})
app.get('/:token/logOff',(req,res)=>{
  //TODO:remove this user from the loggedInUsers array
})

getUserId(token)
{
  return loggedInUsers.filter(x=>x.token == token)[0].userID;
}



if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`listening on: ${port}!`)
  })
}



module.exports = app
