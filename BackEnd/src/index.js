import express from "express";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import dotenv from "dotenv";
import { connectDB } from "./lib/db.lib.js";
import cookieParser from "cookie-parser";
import cors from 'cors'
import { app, server } from "./lib/socket.js";


dotenv.config();

// const app = express(); -> {commented because app is already created in socket file}


const PORT = process.env.PORT;


app.use(express.json()); //helps to extract json data out of file
app.use(cookieParser()); // allows to parse the cookies to grab values out of cookie 
app.use(cors({
        origin: ["http://localhost:5173"], // for coneection between frontend and backend
        credentials: true
    })
);

app.use('/api/auth', authRoutes)
app.use('/api/messages', messageRoutes)
server.listen(PORT, () =>{
    console.log("Server is running in port : "+ PORT);
    connectDB();
});