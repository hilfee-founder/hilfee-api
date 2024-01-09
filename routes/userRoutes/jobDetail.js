const jobPost = require("../../models/jobPost.js");
const mongoose = require('mongoose');

const getJobDetail = async (req, res) => {
    try {
        // Ensure that the request contains the job ID
        const  Id  = req.params.id;

        // console.log(Id);

        if (!Id) {
            return res.status(400).json({ success: false, message: 'Job ID is required' });
        }

        // Validate that Id is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(Id)) {
            return res.status(400).json({ success: false, message: 'Invalid Job ID' });
        }

        // Retrieve job post for the specific job using findById
        const job = await jobPost.findById(Id);

        if (!job) {
            return res.status(404).json({ success: false, message: 'Job not found' });
        }

        res.status(200).json({ success: true, data: { jobPost: job } });
    } catch (error) {
        console.error('Error during job post retrieval:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = getJobDetail;
