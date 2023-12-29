const { Router } = require('express');
const route = Router();
const Signup = require('./signup');
const Login = require('./login');


route.post('/register', Login);
route.post('/signup', Signup);

module.exports = route;