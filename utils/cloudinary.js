const {v2} = require('cloudinary');
const cloudinary = v2();
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null
        }

       const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        console.log("file is upload on cloudinary...",res.url)

        fs.unlinkSync(localFilePath);
        return res;

    } catch (error) {
        fs.unlink(localFilePath);
        return null
    }
}

module.exports = uploadOnCloudinary;