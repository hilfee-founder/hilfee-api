const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    company: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    location: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    requirements: {
        type: String,
        default: null,
    },
    workExp: {
        type: String,
        default: null
    },
    uploadJD: {
        type: String,
        default: null
    },
    ctcRange: {
        type: String,
        default: null
    },
    postedAt: {
        type: Date,
        default: Date.now,
    },
    roleCategory: {
        type: String,
        default: null
    },
    department: {
        type: String,
        default: null
    },
    techSkill: {
        type: Array,
        default: null
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userhr',
        required: true,
    },
},
    {
        timestapm: true
    }
)


const jobPost = new mongoose.model("jobPost", jobSchema);

module.exports = jobPost;