import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";
// get from zustand

// backend routes
// router.get("/users", protectRoute, getUsersForSidebar);
// //as router.get("/users", protectRoute, getUsersForSidebar); protectroute protected then getusers so we get that cuurent (logedin)authenticated user
// // get msgs with userid dynamic
// router.get("/:id", protectRoute, getMessages);
// // send messages
// router.post("/send/:id", protectRoute, sendMessage);

export const useChatStore = create((set,get) => ({
  messages: [],
  users: [],// all users
  selectedUser: null,// user selected to chat with
  isUsersLoading: false,//if true loading skeleton
  isMessagesLoading: false,//same
// function 
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },
// which chat of user
  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
      // we get res that new message we sent

      set({ messages: [...messages, res.data] });// add new message to messages array(previosly loaded messages)
    } catch (error) {
      toast.error(error.response.data.message);
    }
  },

// listen to (event) new messages from socket
  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;

    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      // Check if the new message from sender !=== the selected user
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
      if (!isMessageSentFromSelectedUser) return;

      set({
        messages: [...get().messages, newMessage],
      });
    });
  },
// unsubscribe from new messages when logout or close / component unmounts
//
  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
  


  // this function is called when a user is selected from the sidebar
  // and it fetches the messages for that user
    
  setSelectedUser: (selectedUser) => set({ selectedUser }),



}));