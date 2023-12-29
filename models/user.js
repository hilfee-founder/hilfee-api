const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    lname: {
        type: String,
        trim: true,
        default: null
    },
    email: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    number: {
        type: String,
        unique: true,
        default: null,
    },
    password: {
        type: String,
        required: true,
        default: null,
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
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    }
},
    {
        timestamps: true
    }
)

const users = new mongoose.model("users", userSchema);

module.exports = users;