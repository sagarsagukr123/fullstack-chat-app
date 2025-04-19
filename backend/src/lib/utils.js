import jwt from "jsonwebtoken";

/// payload userid
export const generateToken= (userId,res)=>{
    // Generate token
    const token= jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d",// after 7d user again login


    });
    // Send to user in cookie

    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,//milisec
        httpOnly:true,//not accesible by js prevent xss attacks cross -site script attacks
        sameSite:"strict",// Csrf attacks cros site req forgery attacks
        secure:process.env.NODE_ENV!== "development",// true in production now false bcoz we in dveelopment
        //https http -local host not secure 
    

    } 
    );
    return token;
    //which user belong to this token
    //Synchronously sign the given payload into a JSON Web Token string payload - Payload to sign, could be an literal, buffer or string secretOrPrivateKey - Either the secret for HMAC algorithms, or the PEM encoded private key for RSA and ECDSA. [options] - Options for the signature returns - The JSON Web Token string


};