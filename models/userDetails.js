const mongoose = require('mongoose');

const userDetail = mongoose.Schema({
    fullName:{
        type: String,
        required: true,
        trim: true,
        default: null
    },
    email: {
        type: String,
        default: null,
    },
    contactNo: {
        type: String,
    },
    CV: {
        type: String,
        default: null,
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