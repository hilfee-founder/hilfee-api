const userDetail = require("../../models/userDetails")

const profile=(req,res)=>{
    const CV=req.files.CV[0].filename;
    const cert=req.files.certifications;
    const certifications=cert.map((c)=>{
        return c.filename
    })

    try{
        const user=userDetail({...req.body,CV,certifications})
        user.save()
        console.log(user);
        res.json(user)
    }
    catch(e){
        console.error('Error in uploading:', error);
        res.status(400).json({ success: false, message: "Upload failed!" });
    }
}

module.exports=profile