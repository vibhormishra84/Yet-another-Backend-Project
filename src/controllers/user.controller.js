import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from '../utils/ApiResponse.js';
const registerUser= asyncHandler(async (req,res)=>{
    const {username,email,fullname,password,}=req.body;
    console.log("email,", email);

    if([username,email,fullname,password].some((field)=>field?.trim()==="")){
        throw new ApiError(400,"All fields are required");
    }
    const existedUser=User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"Username or email already exists");
    }
    const avatarLocalPath=req.files?.avatar[0]?.path 
    const coverImageLocalPath=req.files?.coverImage[0]?.path
    // console.log(req.files);  //this access is given by multer middleware
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar is required");
    }

    const avatar=await uploadOnCloudinary(avatarLocalPath)
    const coverImage=await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(500,"Failed to upload avatar");
    }

    const user=await User.create({
        fullname,
        avatar:avatar.url,
        coverImage:coverImage?.url || "",
        username:username.toLowerCase(),
        email,
        password
    })
    const createdUser=await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(201,createdUser, "User registered successfully")
    )
})

export {registerUser,}