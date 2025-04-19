import {v2 as cloudinary} from "cloudinary";
// detsructure
import {config} from "dotenv";

config();
//to acees env variables


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,


})

export default cloudinary;
//updateimage we see in clodinary bucket


