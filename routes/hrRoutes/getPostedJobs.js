const userhr = require("../../models/userHR.js");
const mongoose = require('mongoose');

const getPostedJobs = async (req, res) => {
    try {
        // Ensure that the request contains the HR user ID
        const userId = req.userId;
        
        if (!userId) {
            return res.status(400).json({ success: false, message: 'HR user ID is required' });
        }

        // Validate that userId is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: 'Invalid HR user ID' });
        }

        // Retrieve job posts for the specific HR user
        const hrUser = await userhr.findById(userId);

        if (!hrUser) {
            return res.status(404).json({ success: false, message: 'HR user not found' });
        }

        const postedJobs = await userhr.findById(userId).populate('jobPosts', 'title company location');

        if (!postedJobs) {
            return res.status(404).json({ success: false, message: 'No job posts found for the HR user' });
        }

        res.status(200).json({ success: true, data: { jobPosts: postedJobs } });
    } catch (error) {
        console.error('Error during job post retrieval:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = getPostedJobs;
