require('dotenv').config();
const mongoose = require('mongoose');

url = process.env.MONGODB_URI

mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("connected to MongoDB Database...")
}).catch((error)=>{
    console.log(error )
})