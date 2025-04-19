import express from "express";
import { checkAuth,signup,login,logout,updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup",signup);//not GET bcoz passing creadentials

router.post("/login",login);

router.post("/logout",logout);//use Both get and post 

router.put("/update-profile",protectRoute,updateProfile);
// first check authenticated(protectroute) then update profile

// to check user authentication if protectroute autehntictaed then call checkauth
// //we gonn call this function  when page is refreshed we are going to take to profile or login page
router.get("/check", protectRoute, checkAuth);

export default router;







