const userDetail = require("../../models/userDetails")

const profile=async(req,res)=>{
    const CV=req.files.CV[0].filename;
    const cert=req.files.certifications;
    const certifications=cert.map((c)=>{
        return c.filename
    })

    try{
        const user=await userDetail.create({...req.body,CV,certifications})
        console.log(user);
        res.json(user)
    }
    catch(e){
        console.error('Error in uploading:', e);
        res.json(e)
    }
}

module.exports=profile