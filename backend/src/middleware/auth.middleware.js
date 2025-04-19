import jwt from"jsonwebtoken";
import User from "../models/user.model.js";

// cookie -parser package 
// app.use(cookiePaser()) allow to parse cookie to grab token
//router.put("/update-profile",protectRoute,updateProfile); if protectroute calll succes then next updateprofiile we can call
export const protectRoute=async (req,res,next) => {
    try {
        const token = req.cookies.jwt;// to grab token from cookie we use cookie parser
        // check token is there or not 
        if(!token){
            return res.status(401).json({
                message:"Unauthorized - No Token provided"
            });
        }

        // Decode token with jet sceceret key to get userid(payload we put in token) in it
        //VERIFY TOKEN IN COOKIE WITH PRIVATE KEY
        const decoded= jwt.verify(token,process.env.JWT_SECRET)
        if(!decoded){
            return res.status(401).json({
                message:"Unauthorized - Invalid Token "
            });
        }
        //deselect password we find user by id select everything from uset
        const user= await User.findById(decoded.userId).select("-password");

        if(!user){
            return res.status(404).json({
                message:"User Not Found"
            });}

   // now user authenticated
        req.user= user;// Add user(in Db) into req so we get user
   // proctedroute succes then updateprofile
        next();


        
    } catch (error) {
        console.log("Error in ProtectRoute middleware:", error.message);
        res.status(500).json({
            message:"Internal server error"
        });
        
    }
    
};
