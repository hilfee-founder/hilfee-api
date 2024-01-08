const jobPost = require("../../models/jobPost.js");
const mongoose = require('mongoose');

const getAllJobsForUser = async (req, res) => {
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

        // Retrieve all job posts for the user
        const jobs = await jobPost.find().populate('postedBy', 'fname lname email companyName');

        if (!jobs || jobs.length === 0) {
            return res.status(404).json({ success: false, message: 'No job posts found for the HR user' });
        }

        res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        console.error('Error during job post retrieval:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = getAllJobsForUser;
