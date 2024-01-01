const mongoose = require('mongoose');

const userDetail = mongoose.Schema({
    fullName:{
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
    },
    contactNo: {
        type: String,
        required: true,
    },
    CV: {
        type: String,
        required: true,
    },
    education:{
        college:String,
        degree:String,
        specialization:String,
        clgDuration:String
    },
    workExperience: {
        companyName:String,
        jobTitle:String,
        workDuration:String,
        currentCTC:String
    },
    currentLocation: {
        type: String,
        default: null
    },
    technicalSkills: {
        type: Array,
        default: null
    },
    certifications: {
        type: Array,
        default: null
    },
},
    {
        timestamps: true
    }
)

const userDetailModel = new mongoose.model("userDetail", userDetail);

module.exports = userDetailModel;