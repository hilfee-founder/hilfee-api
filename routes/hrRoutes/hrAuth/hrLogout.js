const express = require('express');
const router = express.Router();

// Logout API endpoint
const hrLogout = async (req, res) => {
    try {

        const token = req.headers;
        console.log(token)
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        res.status(200).json({ success: true, message: 'User logged out successfully' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = hrLogout;
