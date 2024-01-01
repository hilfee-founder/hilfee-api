const mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
    title: String,
    media: String,
    transcription:String
})

const videoModel = new mongoose.model("videoFile", videoSchema);

module.exports = videoModel;