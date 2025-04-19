// Import the Express framework
import express from "express";

// Import the dotenv package to load environment variables from a .env file
import dotenv from "dotenv";

import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
// Import the function to connect to the database
import { connectDB } from "./lib/db.js";
// Import the authentication routes from the routes folder
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
// Import the socket server instance from the socket.js file
import {app,server } from "./lib/socket.js";



// Initialize environment variables (load variables from .env file)
dotenv.config();

// Create an instance of an Express application
//const app = express();
//  app is created in socket.js



// Get the PORT number from environment variables
const PORT = process.env.PORT;
// Get the absolute path of the current directory
const __dirname = path.resolve();
// Body -parser Middleware: Parse incoming JSON request bodies and make them available in req.body
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


app.use(cookieParser());
//{object, then fields}
// send cookies and authheaders with request
app.use(cors({
    origin:"http://localhost:5173",
credentials:true}
    
));

// Mount the authentication (user)routes at the endpoint /api/auth
app.use("/api/auth", authRoutes);

app.use("/api/messages", messageRoutes);
// in production, serve the static files (dist)from the React frontend app we have index.html
// This is useful for serving the frontend application when the backend and frontend are deployed together
// static middleware  from express serves files from a directory
// Serve static files from the React frontend app in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    // Fallback: serve index.html for any unmatched route
    app.get("/*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
    });
  }

// Start the server, listen on the specified PORT
server.listen(PORT, () => {
    // Log a message when the server starts successfully
    console.log("Server is running on PORT " + PORT);

    // Call the function to connect to the database when the server starts
    connectDB();
});

