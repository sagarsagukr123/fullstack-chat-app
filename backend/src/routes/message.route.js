import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
//as router.get("/users", protectRoute, getUsersForSidebar); protectroute protected then getusers so we get that cuurent (logedin)authenticated user


// get msgs with userid dynamic
router.get("/:id", protectRoute, getMessages);

// send messages
router.post("/send/:id", protectRoute, sendMessage);

export default router;