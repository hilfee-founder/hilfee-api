const users = require('../models/userHR.js');


const verifiedUser = async (req, res) => {
    try {
        const userId = req.userId;
        // console.log(userId);
        const userWithId = await users.findById(userId);
        if (!userWithId) {
            return res.status(401).send({ message: "Please authenticate using a valid token", success: false })
        }
        else {
            res.send({ success: true, message: 'verified', data: userWithId });
        }
    }
    catch (error) {
        console.error(error.message);
        res.status(500).json({ message: "Some error occured", success: false, });
    }
}

module.exports = verifiedUser;



// route.post('/verifyuser', fetchUser, async (req, res) => {
//     try {
//       const userId = req.userId;
//       console.log(userId);
//       const userWithId = await users.findById(userId);
//       if (!userWithId) {
//         return res.status(401).send({ message: "Please authenticate using a valid token", success: false })
//       }
//       else {
//         res.send({ success: true, message: 'verified', data: userWithId });
//       }
//     }
//     catch (error) {
//       console.error(error.message);
//       res.status(500).json({ message: "Some error occured", success: false, });
//     }
//   })