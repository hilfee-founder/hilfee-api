const fetchUser = require("../../middlewares/fetchUserFromToken");
const jobPostModel = require("../../models/jobPost");


const getJobPost = async (req, res) => {
    try {
        // Ensure that the request contains the HR user ID
        const { userId } = req.params;

        console.log(userId)
        if (!userId) {
            return res.status(400).json({ success: false, message: 'HR user ID is required' });
        }

        // Retrieve job posts for the specific HR user
        const jobPosts = await jobPostModel.find({ postedBy: userId });
        console.log(jobPosts)
        res.status(200).json({ success: true, data: jobPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

module.exports = (getJobPost);