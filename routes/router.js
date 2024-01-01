const { Router } = require('express');
const route = Router();
const userSignup = require('./userRoutes/userAuth/signup.js');
const userLogin = require('./userRoutes/userAuth/login.js');
const hrSignup = require('./hrRoutes/hrAuth/signup.js');
const hrLogin = require('./hrRoutes/hrAuth/login');
const createJobPost = require('./hrRoutes/jobPost.js');
const getJobPost = require('./hrRoutes/getJobs.js');
const verifyUser = require('../controllers/verifyUser.js');
const fetchUser = require('../middlewares/fetchUserFromToken.js');


route.post('/user/login', userLogin);
route.post('/user/signup', userSignup);
route.post('/hr/login', hrLogin);
route.post('/hr/signup', hrSignup);
route.post('/hr/jobpost', createJobPost);
route.get('/hr/getjobpost/:id', getJobPost);
route.post('/verifyuser', fetchUser, verifyUser);




module.exports = route;