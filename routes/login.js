const User = require('../models/user');
const bcrypt = require('bcrypt');
const JWT_SECRET = 'thisisthesecratekeyoftheproject12345'
const jwt = require('jsonwebtoken');

const Login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Validation
        if (!email || !password) {
            res.status(422).json({ success: false, message: "Something is missing in email/password" });
            return;
        }

        const userlogin = await User.findOne({ email: email });

        if (!userlogin) {
            return res.status(401).json({ message: 'Authentication failed' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, userlogin.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Authentication failed' });
        }


        // Return token for future authentication
        const token = jwt.sign({ userId: userlogin._id }, JWT_SECRET, { expiresIn: '1h' });

        res.cookie("user_data", token, {
            expires: new Date(Date.now() + 900000),
            httpOnly: true
        })

        res.status(200).json({ success: true, userlogin, token });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: "Login failed!" });

    }


}

module.exports = Login;