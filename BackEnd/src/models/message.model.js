
import mongoose from "mongoose";


const messageSchema = new mongoose.Schema({

    // User reference pass karenge kyuki sender/receiver dono user hai
    senderId : {
        type : mongoose.Schema.Types.ObjectId, // tell to MongoDb that senderId/receiverId will be reference to user model
        ref : "User",
        required : true
    },
   receiverId : {
        type : mongoose.Schema.Types.ObjectId, //
        ref : "User",
        required : true
    },
    text : {
        type : String
    },
    image : {
        type : String
    },
    },
    {timestamps : true}
);

const Message = mongoose.model("Message",messageSchema);

export default Message;