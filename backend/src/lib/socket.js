import { Server, Socket } from "socket.io";
import http from "http";
import express from "express";
// socket.io is a library that enables real-time, bidirectional communication between web clients and servers. It allows you to send and receive messages in real-time, making it ideal for applications like chat apps, notifications, and live updates.
// built on top of express,nodejs server
// express is a web application framework for Node.js, designed for building web applications and APIs. It simplifies the process of handling HTTP requests, routing, and middleware integration, making it easier to develop server-side applications.
// http is a built-in module in Node.js that allows you to create HTTP servers and clients. It provides methods for handling requests and responses, making it essential for building web applications.
// backend server and frntend both have socket.io(client and server)
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

// we pass userId it returns the socketId of the user
export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
  }

// used to store online users
const userSocketMap = {}; // {userId: socketId}// map of userId to socketId key value pair
// userId is the unique identifier of the user(DB)and socketId is the unique identifier of the user's socket connection. This mapping allows the server to send messages to specific users by their userId.

// listen for incoming socket connections(clientside)
//Adds the listener function as an event listener for events of the specified type. The listener is invoked whenever an event of the specified type occurs.
//socket id is a unique identifier for each socket connection. It allows the server to identify and communicate with specific clients.
io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
  // handshake is a process that establishes a connection between the client and server. It allows the server to authenticate the client and establish a session.
    const userId = socket.handshake.query.userId;
    // userId is passed from the client side when connecting to the socket

    if (userId) userSocketMap[userId] = socket.id;
  
    // io.emit() is used to send events to all the connected clients
    //if users online then send online users to all clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  
    socket.on("disconnect", () => {
      console.log("A user disconnected", socket.id);
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
    // if users offline then send offline users to all clients
});

export { io, app, server };

// io using in message.controller.js to send messages to the receiver in real time
// Move to message.controller.js