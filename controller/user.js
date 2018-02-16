const loggedInUsers = require('../models/userlist.js')
const model = require('../models/user.js')

function CPLogin(req,res)
{
  un = req.body.username;
  pw = req.body.password;
  model.MPLogin(un, pw, res);
}
function CPNewUser(req,res)
{
  un = req.body.username;
  pw = req.body.password;
  model.MGNewUser(un, pw, res);
}
function CGFunds(req, res)
{
  model.MGFunds(getUserId(req.params.token), res);
}
function getUserId(token)
{
  return loggedInUsers.filter(x=>x.token == token)[0].userID;
}
module.exports = {CPLogin,CPNewUser,CGFunds}
