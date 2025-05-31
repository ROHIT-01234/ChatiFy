import cloudinary from "../lib/cloudinary.lib.js";
import { generateToken } from "../lib/utils.lib.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs"


export const signup = async (req, res) => {
    // Database setup karenge sighup ke liye
    // signup ka logic likenge
    const { fullName, email, password } = req.body;

    try {
        // hashing password 
        // 1. sari field check karenge
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Please fill all fields" })
        }
        // 2. password 6 chracter ka h ki nahi
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be atleast 6 Characters"
            });
        }

        // ha to user create karenge
        const user = await User.findOne({ email });

        // agar user pehle se exist hai
        if (user) {
            return res.status(400).json({
                message: "User already exits."
            });
        }

        // password ko encrypt kaenge
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt); //1323245 => dsnafhjbsdhjbfjkbsjsbajjdks

        const newUser = new User({
            fullName, // fullName: fullName => shorten
            email,
            password: hashedPassword
        });

        if (newUser) {
            // jwt token generate karenge jo authentication ke liye help karega
            generateToken(newUser._id, res);
            await newUser.save(); // User ko database me save karega

            res.status(200).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,

            });

        }
        else {
            return res.status(400).json({
                message: "Invalid user data"
            });
        }


    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const login = async (req, res) => {

    const { email, password } = req.body;

    try {
        // email database me hai ki nahi
        const user = await User.findOne({ email });

        // agar exist nhi karta to
        if (!user) { // email ya password wrong batane ki jagah invalid batayenge, kyuki usse kisi malicious user ka pata nahi rahega ki kya galat dal rahe hai
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        // agar exist karta hai to
        const isPasswordCorrect = await bcrypt.compare(password, user.password); // (boolean result) hashed password ko compare karenge ki sahi h ki nahi 
        if (!isPasswordCorrect) { // incorrect password hai agar
            return res.status(400).json({
                message: "Invalid Credentials"
            });
        }

        //agar password dahi h to token generate karenge    
        generateToken(user._id, res)

        // successfull login status
        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        });


    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const logout = (req, res) => {
    // agar user logout kar rha h to bas cookies clear karna h
    try {
        res.cookie("jwt","", { maxAge: 0 });// immediately expire ho jaega
        res.status(200).json({
            message: "Logged Out Successfully."
        })
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const update = async (req,res) =>{

    // sirf profile picture hi update karne ka option hoga
    try {
        // cloudinary -> service to upload images
        const {profilePic} = req.body;

       const userId = req.user._id; //req.user protectRoute me define hai/pass hua h
       
       if(!profilePic){
        return res.status(400).json({
            message : "Profile Picture required"
        });
       }

        // agar hai to cloudinary me upload karo
        const uploadResponse = await cloudinary.uploader.upload(profilePic) // cloudinary DB nahi ek bucket hai images ke liye
        const updatedUser = await User.findByIdAndUpdate(userId,{
            profilePic : uploadResponse.secure_url
        },
        {
            new : true // new true karne se updated/new info after update return karega instead of prev info before update
        });

        return res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error in update controller", error.message);
        res.status(500).json({
            message : "Internal server error"
        });
    }
};

export const checkAuth = (req,res) =>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({
            message : "Internal server error"
        });
    }
};