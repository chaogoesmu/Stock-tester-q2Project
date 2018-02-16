const express = require('express');
const app = express();
const ctrl = require('../controller/user.js')

app.post('/login', ctrl.CPLogin);
//add a new user TODO: test this
app.post('/newUser', ctrl.CPNewUser);
//return the users current funds
app.get('/:token/funds',ctrl.CGFunds);

module.exports = app;
