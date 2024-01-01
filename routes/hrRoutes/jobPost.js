const mongoose = require('mongoose');
const jobPostModel = require('../../models/jobPost');
const userHrModel = require('../../models/userHR');

const createJobPost = async (req, res) => {
    try {
        const {
            title,
            company,
            location,
            description,
            requirements,
            workExp,
            uploadJD,
            ctcRange,
            roleCategory,
            department,
            techSkill,
            postedBy, // Include HR user ID in the request body
        } = req.body;

        // Check for required fields
        if (!title || !company || !location || !postedBy) {
            return res.status(400).json({ success: false, message: 'Title, company, location, and HR user ID are required fields' });
        }

        // Check if the HR user exists
        const hrUser = await userHrModel.findById(postedBy);
        if (!hrUser) {
            return res.status(404).json({ success: false, message: 'HR user not found' });
        }

        const newJobPost = new jobPostModel({
            title: title,
            company: company,
            location: location,
            description: description,
            requirements: requirements,
            workExp: workExp,
            uploadJD: uploadJD,
            ctcRange: ctcRange,
            roleCategory: roleCategory,
            department: department,
            techSkill: techSkill,
            postedBy: postedBy, // Assign HR user ID to the 'postedBy' field
        });

        // Save the new job post to the database
        const jobs = await newJobPost.save();

        // Update the HR user's jobPosts field with the new job post ID
        hrUser.jobPosts.push(newJobPost._id);
        await hrUser.save();

        res.status(201).json({ success: true, message: 'Job post created successfully', data: jobs });
    } catch (error) {
        // Handle validation errors
        if (error instanceof mongoose.Error.ValidationError) {
            const errorMessages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ success: false, message: 'Validation error', errors: errorMessages });
        }

        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

module.exports = createJobPost;
