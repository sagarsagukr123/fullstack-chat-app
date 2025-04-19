import User from "../models/user.model.js";
import Message from "../models/message.model.js";

import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    // (side)we fetch every user chats not ours
  try {
    const loggedInUserId = req.user._id;
    // as router.get("/users", protectRoute, getUsersForSidebar); protectroute protected then getusers so we get that cuurent (logedin)authenticated user

    // find all users id not != logedin user id
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);// send all users to client no password
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// get to see conversation msg 
export const getMessages = async (req, res) => {
  try {
    //rename id to usercahtid
    const { id: userToChatId } = req.params;//dynamic
    //myid(senderid)
    const myId = req.user._id;//cuurrent authentcated id
//find all msgs inclusding me
    const messages = await Message.find({
        // array with filter options
      $or: [
        { senderId: myId, receiverId: userToChatId },// all msgs sender me reciever other
        { senderId: userToChatId, receiverId: myId },// viceversa
      ],
    });

    res.status(200).json(messages);//return all messages
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // Upload base64 image to cloudinary
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
// create new message and save to DB
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });


    await newMessage.save();
// after saving the message(DB), send msg to user in real time
//  emit the event to the receiver
    const receiverSocketId = getReceiverSocketId(receiverId);
    // if reciversocktetId exists user is online
    // send the new message to the receiver real time
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }// broadcast to receiver only(private chat not group chat)
// resource cretaed 201, send msg back to client
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};