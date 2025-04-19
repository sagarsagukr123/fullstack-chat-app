import mongoose from "mongoose";

//Schema

const userSchema= new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    fullName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:6

    },
    profilePic:{
        type:String,
        default:""// not required default empty we can update this AFTER
    },

},
{timestamps:true});//createdAt and updatedAt

//Model
// User model based on userSchema
const User= mongoose.model("User",userSchema)//Message or User data(Model) capital  // default in mongoose users

export default User;