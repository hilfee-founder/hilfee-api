
const userDetail = require("../../models/userDetails")
const { body, validationResult } = require('express-validator');

const profile=async(req,res)=>{
    
    const { fullName, email, contactNo, education, currentLocation } = req.body;

    //Check required fields
    if (!fullName || !email || !contactNo || !education || !currentLocation ||!req.files.CV) {
        return res.status(499).json({ success: false, message: "Please Enter all the required fields" });
    }

    //Set CV filename into variable
    const CV=req.files.CV[0].filename;  

    // Input all certificates into array
    if(req.files.certifications){
        const cert=req.files.certifications; 
        var certifications=cert.map((c)=>{ 
            return c.filename
        })
    }
    


    try{

        // Validation
        const validateProfileInputs = [
            body('email').isEmail(),
            body('contactNo').isLength({ min: 10 }),
        ];

        // Check for validation errors
        await Promise.all(validateProfileInputs.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ success: false, errors: errors.array() });
        }

        const userdetail=await userDetail.create({...req.body,CV,certifications})
        console.log(userdetail);
        res.json(userdetail)
    }
    catch(e){
        console.error('Error in uploading:', e);
        res.json(e)
    }
}

module.exports=profile

