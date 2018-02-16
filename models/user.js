const loggedInUsers = require('./userlist.js')
const env = 'development';
const config = require('../knexfile')[env];
const knex = require('knex')(config);
const uuid = require('uuid/v4');
function MPLogin(un, pw, res)
{
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
}
function MGNewUser(un, pw, res)
{
  knex('users')
  .insert({username: un, password: pw, funds:50000})
  .then(results=>{
    if(results.length>0)
    {
      uuOut = uuid();
      loggedInUsers.push({userID:results[0].id,token:uuOut});
      return res.status(200).send(uuOut)
    }
    res.status(401).send('Access Denied')
  });
}
function MGFunds(userID, res)
{
  console.log('funds request');
  knex('users')
  .select('funds')
  .where({id:userID})
  .then(results=>{
    console.log(results);
    return res.status(200).send(results[0].funds+'');//this bug in send annoys me greatly
  });
}
function MGLogoff(token, res)
{
  token =parseInt(token,10);
  let something = loggedInUsers.findIndex(x => x.token === token);
  if(something===-1)
  {
    return res.status(400).send('user not found, something went wrong');
  }
  loggedInUsers.splice(something,1);
  return res.status(200).send('user has been logged off, goodbye');
}

module.exports = {MGFunds,MGNewUser,MPLogin,MGLogoff}
