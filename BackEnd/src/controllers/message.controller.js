import cloudinary from "../lib/cloudinary.lib.js";
import { getReceiverSocketId, io } from "../lib/socket.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";


export const getUsers = async (req, res) => {
    // fetch every single user except the authenticateds user for sidebar (means ourself)

    try {
        const loggedUserId = req.user._id;
        const filterUsers = await User.find({
            _id: { $ne: loggedUserId } // tells moongoose to return all the users except the currently loggeed in user
        }).select("-password"); //fetch everything except the password

        res.status(200).json(filterUsers);
    } catch (error) {
        console.log("Error in getUser controller", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params //id is dymanic; the one we passing the enpoints
        const currUserId = req.user._id; // me

        const message = await Message.find({ // find all the messages where i am the sender or other user is sender
            $or: [
                { senderId: currUserId, receiverId: userToChatId }, // sender : me or receicer : other user
                { senderId: userToChatId, receiverId: currUserId } // sender : other user or receicer : me
            ]
        });

        res.status(200).json(message);

    } catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

export const sendMessages = async (req, res) => {
    // message text/image ho sakta hai
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) { // if image is send them upload it to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        // implement real time functionlity => using socket.io
        const receiceSocketId = getReceiverSocketId(receiverId);
        if(receiceSocketId) {
            io.to(receiceSocketId).emit("newMessage",newMessage); // io.emit() sent to everyone , so to helps to send only to receiver (because it's not a grp chat , it's one-n-one chat)
        }


        res.status(201).json(newMessage); //201 -> new resource is been created

    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};