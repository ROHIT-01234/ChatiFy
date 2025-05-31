// add socket sever on top of app server

import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);


// Socket Server
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

// return socketId for userId
export function getReceiverSocketId(userId){
    return userSocketMap[userId];
}

// online users ko store karega
const userSocketMap = {}; // {userId : socketId}

// listen any incoming connections
io.on("connection", (socket) => {
    console.log("A User Connected", socket.id);

    const userId = socket.handshake.query.userId;
    if(userId) userSocketMap[userId] = socket.id; // updating with online users

    // io.emit() sare connected clients ko events send karega
    io.emit("getOnlineUsers", Object.keys(userSocketMap));


    // listen any disconnections
    socket.on("disconnect", () => {
        console.log("A User Disconnected", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });

});


export { io, app, server };
