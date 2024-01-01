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
    phone: {
        type: Number,
    },
    CV: {
        type: String,
        default: null,
    },
    Education:{
        college:String,
        degree:String,
        Specialization:String,
        Duration:String
    },
    workExp: {
        company:String,
        job_title:String,
        Duration:String
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