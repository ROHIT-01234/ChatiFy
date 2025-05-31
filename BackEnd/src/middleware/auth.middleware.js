import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req,res,next) =>{
    try {
        const token  = req.cookies.jwt;
        
        if(!token){
            return res.status(401).json({
                message : "Unauthorized : No token provided"
            });
        }

        // if token is present (which is gibberish) then decode it
        const decoded = jwt.verify(token,process.env.JWT_AuthKey); // env ->private key h decode karne ke liye

        // if decoded is falsy value
        if(!decoded){
            return res.status(401).json({
                message : "Unauthorized : Invalid token "
            });
        }

        // and if it's not
        const user = await User.findById(decoded.userId).select("-password"); //password field deselect karenge (sending password back to client is not secure)

        if(!user){
            return res.status(404).json({
                message : " User not found"
            });
        }

        // if user is successfully authenticated
        req.user = user;

        // move to next func after authentication (which if update)
        next();

    } catch (error) {
        console.log("Error in protectRoute middleware", error.message);
        res.status(500).json({
            message : "Internal server error"
        });
    }
}


