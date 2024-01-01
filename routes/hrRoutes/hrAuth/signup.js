const User = require('../../../models/userHR');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const hrSignup = async (req, res) => {
    const { fname, lname, email, companyName, designation, number, password } = req.body;

    if (!fname || !lname || !companyName || !email || !designation || !number || !password) {
        res.status(422).json({ success: false, message: "wrong credintial" });
        return;
    }

    try {

        // Validation
        const validateSignupInputs = [
            body('fname').notEmpty(),
            body('lname').notEmpty(),
            body('companyName').notEmpty(),
            body('designation').notEmpty(),
            body('email').isEmail(),
            body('number').isLength({ min: 10, max: 10 }),
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
                fname: fname,
                lname: lname,
                companyName: companyName,
                designation: designation,
                email: email,
                number: number,
                password: hashedPassword
            })
            const userData = await user.save();

            // console.log(userData);

            // Return token for future authentication
            const token = jwt.sign({ userId: userData._id }, JWT_SECRET, { expiresIn: '1h' });

            res.status(201).json({ success: true, message: "User is created", token, userData });

        }

    } catch (error) {
        console.error('Error during registration:', error);
        res.status(400).json({ success: false, message: "registration failed!" });
    }
}

module.exports = hrSignup;