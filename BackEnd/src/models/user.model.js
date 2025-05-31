
import mongoose from "mongoose";


// Users DB Requierment/Schema : {fullname, emailID, password, profilePic}; DB Provided : {_id, timestamp(CreatedAt,UpdatedAt) for case like user since..}
const userSchema = new mongoose.Schema(
    {
        email:{
            type: String,
            required: true,
            unique: true,
        },
        fullName:{
            type: String,
            required: true,
        },
        password:{
            type: String,
            required: true,
            minlength:6,
        },
        profilePic:{
            type: String,
            default: ""
        },
    },
    {timestamps: true} // for createdAt and updatedAt
);

const User = mongoose.model("User",userSchema);

export default User;