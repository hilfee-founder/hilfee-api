const { Router } = require('express');
const route = Router();
const userSignup = require('./userRoutes/userAuth/signup.js');
const userLogin = require('./userRoutes/userAuth/login.js');
const hrSignup = require('./hrRoutes/hrAuth/signup.js');
const hrLogin = require('./hrRoutes/hrAuth/login');
const userProfile=require('../routes/userRoutes/profile.js')
const cpUpload=require('./multer/multer.js')


route.post('/user/login', userLogin);
route.post('/user/signup', userSignup);
route.post('/hr/login', hrLogin);
route.post('/hr/signup', hrSignup);
route.post('/user/profile',cpUpload, userProfile);

module.exports = route;