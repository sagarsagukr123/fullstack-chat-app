import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup= async(req,res)=>{
    const {fullName,email,password}= req.body;//extract email,pass,fullname from reqbody for signup
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
          }

        if(password.length<6){
            return  res.status(400).json({message:"Password must be at least 6 characters"});


        }
        const user= await User.findOne({email})
        if(user)
            return res.status(400).json({message:"Email already exists"});
        const salt= await bcrypt.genSalt(10)
        const hashedpassword= await bcrypt.hash(password,salt);
        //1213334-  sdnsk232k32dksdmk2nekn2

        const newUser= new User({
            fullName,// or fullname only
            email,
            password:hashedpassword
        })

        // newuser creation,token,cookie generate
        if(newUser){
            //generate jwt token for autehntication after signup deteails 
            generateToken(newUser._id,res);// function

            await newUser.save();// save newuser to db

            //succes status for user 

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,


            });

        }else{
            res.status(400).json({message:"Invalid user data"});//error msg
        }



        
    } catch (error) {// debug error 
        console.log("Error in signup controller",error.message);
        res.status(500).json({
            message:"Internal Server Error"
        });
        
    }
  
};

// for login 
//user-> email,password->post req-> login api-> extract email,pass from reqbody
// -> find user(exists)->compare password->if yes->generate token->suces status to user
export const login = async (req, res) => {
  const { email, password } = req.body;//extract email,pass from reqbody for login
  //app.use(express.json()))	Parses incoming JSON requests ,and Converts them into JavaScript objects Attaches the result to req.body
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Logout-> clear cookies and delete user from datbase
export const logout = (req, res) => {
    try {
      res.cookie("jwt", "", { maxAge: 0 });// clear cookie set val of string empty
      res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
      console.log("Error in logout controller", error.message);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };


export const updateProfile = async (req, res) => {
  // service clodinary
  try {
    const { profilePic } = req.body;// get/grab image in reqbody sent by user
    const userId = req.user._id;// which user uploading -we acces user (currentuser of protectroute) from req
    // req.user= user;// Add user (in Db) into req so we get user
   // proctedroute succes then updateprofile  --next();

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }
// upload to cloudinary that gives response
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    // cloudinary bucket(not DB) only  to upload image then update profilepic in db
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// to check user authentication if protectroute autehntictaed then call checkauth
// //we gonn call this function  when page is refreshed
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);//sens user back to client thsi will give u authenticated user
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};




//   🍪 What is a Cookie?
// A cookie is a small piece of data that the server sends to the client’s browser, which is then stored locally and sent back to the server with each subsequent request.

// ✅ Uses:
// Storing session IDs

// Storing small pieces of data (like preferences)

// Managing logged-in user states

// Stored where?	Browser	Use	Session management, store tokens, preferences	
// Format	Key-Value pair	
// Secure option	httpOnly, Secure, SameSite flags

// ✅ Format:
// A cookie is a simple key-value pair:

// t
// Set-Cookie: token=abc123; HttpOnly; Secure; SameSite=Strict

// 🔑 What is a Token?
// A token (like a JWT — JSON Web Token) is a digitally signed string that encodes information like user identity and permissions, used for verifying identity in stateless authentication.

// ✅ Uses:
// Authentication — verify who the user is

// Authorization — control what the user can access
// header.payload.signature

// Passed between client and server (often in headers or cookies)

// ✅ Format:
// A JWT token typically has 3 parts:

// xxxxx.yyyyy.zzzzz
// Header → type of token and algorithm used

// Payload → user data (id, email, etc.)

// Signature → verifies it wasn’t tampered Signed with secret or private key


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
// eyJ1c2VySWQiOiIxMjM0IiwidXNlcm5hbWUiOiJTYWdhciJ9.
// SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
// ✅ How They Work Together
// Usually in authentication systems:

// ✅ 1️⃣ Signup — (User creates an account)
// ▶️ What happens:
// User sends their details (name, email, password) to your /signup API.

// Server creates a new user in the database.

// Server does NOT usually issue a token yet (unless auto-login is part of your signup — optional).

// ✅ 2️⃣ Login — (User authenticates)
// ▶️ What happens:
// User sends their email & password to /login.

// Server verifies credentials.

// If correct → server generates a JWT token with user info.

// Server sends this token back to the client as an HttpOnly cookie.

// Browser stores the cookie.

// On every next request, the browser sends the cookie (with the token) automatically.

// Server verifies the token on each request.

// Sends it back via a cookie:

// ✅ 3️⃣ Protected Route — (User accesses a dashboard)
// ▶️ What happens:
// Every time the client requests a protected route like /dashboard, the browser automatically sends the token cookie with the request.

// Server extracts the token from the cookie.

// Server verifies it using jwt.verify().

// If valid, it allows access to the route.

// [User] --signup--> [Server] --> 201 Created
// [User] --login(email+password)--> [Server] --> generate JWT --> set HttpOnly cookie
// [Browser] --with token cookie--> [Protected Route] --> [Server verifies JWT] --> allow or deny
// [User] --logout--> [Server] --> clear token cookie
