const User = require('../../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const userSignup = async (req, res) => {
    const { fname, lname, email, password, number } = req.body;

    if (!fname || !lname || !email || !password || !number) {
        res.status(422).json({ success: false, message: "Wrong credentials" });
        return;
    }

    try {

        // Validation
        const validateSignupInputs = [
            body('fname').notEmpty(),
            body('lname').notEmpty(),
            body('email').isEmail(),
            body('password').isLength({ min: 3 }),
            body('number').isNumeric(),
        ];

        // Check for validation errors
        await Promise.all(validateSignupInputs.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ success: false, errors: errors.array() });
        }

        // Check if user already exists
        const checkUser = await User.findOne({ email: email });
        if (checkUser) {
            res.status(422).json({ success: false, message: "This user is already present" });
        } else {

            // Hash password
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Create new user
            const user = new User({
                fname: fname,
                lname: lname,
                email: email,
                password: hashedPassword,
                number: number
            });
            const userData = await user.save();

            // Return token for future authentication
            const token = jwt.sign({ userId: userData._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(201).json({ success: true, message: "User is created", token });

        }

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(400).json({ success: false, message: "Registration failed!" });
    }
}

module.exports = userSignup;
