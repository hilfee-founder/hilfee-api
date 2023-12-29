const mongoose = require('mongoose');


const userHr = mongoose.Schema({
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
    avatar: {
        type: String,
        default: null,
    },
    companyName: {
        type: String,
        default: null
    },
    designation: {
        type: String,
        default: null
    },
},
    {
        timestamps: true
    }
)

const userhr = new mongoose.model("userhr", userHr);

module.exports = userhr