import jwt from "jsonwebtoken" 

export const generateToken = (userId,res)=>{

    const token = jwt.sign({userId}, process.env.JWT_AuthKey,{
        expiresIn : "7d", // 7 days ke bad expire ho jayega token
    }); // yaha token decode karne ke user ke bare me pta chalega

    res.cookie("jwt",token,{
        minAge : 7*24*60*60*1000, //millisec me
        httpOnly : true, //prevents XSS attacks cross-site scripting attacks
        sameSite : "strict",// CSRF attacks cross-site request forgery attacks
        secure : process.env.NODE_ENV !== "development" // determine if its https/http (localhost me false ayega)
    });

    return token;
};