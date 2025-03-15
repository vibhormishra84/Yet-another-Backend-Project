import mongoose from "mongoose";
import brcypt from "brcypt";
import jwt from "jsonwebtoken";
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullname:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
    avatar:{
        type:String, //cloudinary url has to be used here
        required:true,
    },
    coverImage:{
        type:String, //cloudinary url has to be used here
    },
    watchHistory:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }],
    password:{
        type:String,
        required:[true,"Password is required"],
    },
    refreshToken:{

    }
},{timestamps:true});
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        return next();
    }
    this.password=brcypt.hash(this.password,10);
    next();
})
userSchema.methods.isPasswordCorrect=async function(password){
    return await brcypt.compare(password,this.password);
}
userSchema.methods.generateAccessToken=async function(){
    return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
)
}
userSchema.methods.generateRefreshToken=async function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
)
}
export const User=mongoose.model("User",userSchema);