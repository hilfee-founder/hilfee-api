const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    gender: {
        type: String,
        default: null,
    },
    dob: {
        type: Date,
    },
    avatar: {
        type: String,
        default: null,
    },
    resume: {
        type: String,
        default: null,
    },
    education: {
        type: String,
        default: null
    },
    workExp: {
        type: String,
        default: null
    },
    duration: {
        type: Number,
        default: null
    },
    currentLocation: {
        type: String,
        default: null
    },
    currentPay: {
        type: String,
        default: null
    },
    techSkill: {
        type: Array,
        default: null
    },
    certification: {
        type: String,
        default: null
    },
},
    {
        timestapm: true
    }
)

const userDetail = new mongoose.model("userDetail", userSchema);

module.exports = userDetail;