// diffreent state used in diff componenets
// creatted in store(one place) use it in any components

import {create} from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
// backend endpoint
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";
 // Default to localhost if not set in env
//const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";
// set function and callback function return object
export const useAuthStore= create((set,get)=>({
    authUser:null,// user authenticated or not
    isSigningUp:false,
    isLoggingIn:false,
    isUpdatingProfile:false,
    isCheckingAuth:true,
    onlineUsers: [],// loading state// refresh page check if user is authenticated/not
    // loading spinner checking
    // socket connection
    socket:null,

    //baceknd endpoint /check
    // send a req to endpoint checkAuth
    //refresh page check if user is authenticated/not
    checkAuth:async () => {
        try {
            //get req to backend checkauth api
            const res= await axiosInstance.get("/auth/check");
            set({
                authUser:res.data
            });
            get().connectSocket();// connect to socket if authenticated
        } catch (error) {
            console.log("Error in checkAuth",error);
            set({authUser:null});
            
        }finally{
            set({
                isCheckingAuth:false
            });
        }
        
    },
// issigningup true button show loading state   
signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      // Fallback safe error message
      toast.error(error.response?.data?.message || error.message || "Signup failed");
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");

      get().connectSocket(); // Re-enable the socket connection
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

//isloging out state not required bcoz this logout functionalty is super quick
  logout:async (params) => {
    try {
      await axiosInstance.post("/auth/logout");
      set({authUser:null});
      toast.success("Logged out successfully");
      get().disconnectSocket(); // Disconnect the socket on logout

      
    } catch (error) {
      toast.error(error.response.data.message)// errorgetting from backend
      
    }
    
  },
  // data -profilepic  
 
  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response.data.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },
  // socket connection after login/signup/checkauth
  // connect to socket when user is authenticated
  connectSocket: () => {
    // if user is not authenticated or socket is already connected, return
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;
// same as backend socketjs
    // connect to socket server using socket.io-client
    // connect to base url 
    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });

    socket.connect();// connect to socket server
// set socket to state
    set({ socket: socket });
// listen for online users (update online users array in state)
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },
  // disconnect socket when user logouts
  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },// disconnect socket when user logouts
  


}));