require('dotenv').config()
const jwt = require('jsonwebtoken');


//Get the user from the jwt token add add id to the req object 
const fetchUser = async (req, res, next) => {


    // bringing token from user
    const token = req.header('token');
    console.log('Received token:', token);

    if (!token) {
        res.status(401).send({ message: "Please give valid token" })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) //will decode the token
        console.log('Decoded token:', decoded);
        req.userId = decoded.userId;
        next()
    }

    catch (error) {
        res.status(401).send({ message: "Please authenticate using a valid token" })
    }

}


module.exports = fetchUser;
