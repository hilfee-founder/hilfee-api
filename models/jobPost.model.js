const mongoose = require('mongoose');

const jobSchema = mongoose.Schema({

})


const jobDetail = new mongoose.model("jobDetail", jobSchema);

module.exports = jobDetail;