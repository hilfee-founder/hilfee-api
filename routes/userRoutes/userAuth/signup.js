const User = require('../../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const userSignup = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(422).json({ success: false, message: "wrong credintial" });
        return;
    }

    try {

        // Validation
        const validateSignupInputs = [
            body('name').notEmpty(),
            body('email').isEmail(),
            body('password').isLength({ min: 3 }),
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
                name: name,
                email: email,
                password: hashedPassword
            })
            const userData = await user.save();


            // Return token for future authentication
            const token = jwt.sign({ userId: userData._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(201).json({ success: true, message: "User is created", token });

        }

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(400).json({ success: false, message: "registration failed!" });
    }
}

module.exports = userSignup;