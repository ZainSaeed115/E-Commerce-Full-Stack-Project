import User from "../models/userModels.js"
import asyncHandler from "../middlewares/asyncHandler.js"
import generateTokens from "../utils/createTokens.js"
import bcrypt from "bcryptjs"


const generateAccessAndRefreshTokens= async (userId)=>{
  try {
     const user= await User.findById(userId)
     const accessToken= user.generateAccessToken()
     const refreshToken=user.generateRefreshToken()
     user. refreshToken=refreshToken
     await user.save({validateBeforeSave:false})
 
     return{accessToken,refreshToken}
  } catch (error) {
    res.status(500).json({
      message:"Something went wrong while generating access and refresh token"
    })
    
  }
 }
// user registeration
const createUser=asyncHandler(async (req,res)=>{

  // get user details
   const{userName,email,password}=req.body
   
   // check user entered details
   if([userName,email,password].some((field)=>field?.trim()=="")){
     res.status(400).json({
       message:"All fields are required"
     })
   }

   // check user already existence
   const userExisted= await User.findOne({
    $or:[{userName},{email}]
   }
   )

   if(userExisted){
    res.status(409).json({
      message:"User Already exist"
    })
   }

   const userId= await User.create(
    {
      userName,
      email,
      password,
    }
   )

   const user= await User.findById(userId._id)
   const {accessToken,refreshToken}=generateAccessAndRefreshTokens(user)

   if(!user){
      res.status(500).json({
        message:"Something went wrong while creating user"
      })
   }
   const options={
    httpOnly:true,
    secure:true,
  }
   res
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .status(200).json({
     user,
     message:"User Created Successfully",
     success:true
   })



})

// user login

const userLogin= asyncHandler(async (req,res)=>{
   const {userName,email,password}=req.body

   if(!(userName|| email)){
     res.status(400).json({
      message:"userName or email is required"
     })
   }

   const user= await User.findOne({
    $or:[{userName},{email}]
   })

   if(!user){
    res.status(400).json(
      {
        message:"User does not exist"
      }
    )
   }

   const isPasswordValid= await user.isPasswordCorrect(password)

   if(!isPasswordValid){
    res.status(401).json({
      message:"Invalid User Credentials"
    })
   }

   
   const {accessToken,refreshToken} =await generateAccessAndRefreshTokens(user._id)
   console.log("accessToken:",accessToken)
   const options={
     httpOnly:true,
     secure:true,
   }
   const loggedInUser= await User.findById(user._id).select("-password")
   
   return res.status(200)
   .cookie("accessToken",accessToken,options)
   .cookie("refreshToken",refreshToken,options)
   .json({
     message:"User loggedIn Successfully",
     user:loggedInUser,
 
     success:true
   })

   
})

// user logged out

const userLoggedOut=asyncHandler(async (req,res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
         refreshToken:undefined
      }
    },
    {
      new:true
    }
  )
  const options={
    httpOnly:true,
    secure:true,
  }

  return res
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json({
     success:true,
     message:"User Loggedout"
  })

})

// access all user by admin
const getAllUsers=asyncHandler(async (req,res)=>{
 const users= await User.find({})
 res.json(users)

})

// get current user profile
const getCurrentUserProfile=asyncHandler(async (req,res)=>{
  const user= await User.findById(req.user._id).select("-password -isAdmin")

  if(user){
    res.status(200).json(
      user
  )
  }
  else{
    res.status(404).json({
      message:"User not found"
    })
  }
})

// update current user profile

const updateCurrentUserProfile=asyncHandler(async (req,res)=>{
  const {userName,password}=req.body
  
  const updateFields = {};

  if(userName){
    updateFields.userName=userName
  }

  if(password){
    const hash = await bcrypt.hash(password,10)
    updateFields.password=hash
  }

  const user= await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:updateFields
    },
    {
      new:true
    }
  )

  if(!user){
  res.status(404).
  json({
    message:"User Not Found",
    UserUpdatedData:{},
    success:false
  })
  }

  res.status(200).
  json({
    message:"User data Updated Successfully",
    user:user,
    success:true
  })
})

// delete user with id by admin

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      return res.status(400).json({
        message: "Cannot delete Admin user",
        success: false
      });
    }

    await User.deleteOne({ _id: user._id });
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res.status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({
        message: "User Deleted Successfully",
        success: true
      });
  } else {
    return res.status(404).json({
      message: "User not found",
      success: false
    });
  }
});


const getUserById=asyncHandler(async (req,res)=>{
  const user= await User.findById(req.params.id).select("-password")

  if(user){
    return res.status(200).json(user)
  }
  else{
   return res.status(404).json({
      message:"User Not Found"
    })
  }
})

// update user by id from admin
const updateUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    const { userName, email, isAdmin } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: { userName, email, isAdmin }
      },
      { new: true }
    );

    return res.status(200).json({
      message: "User Updated Successfully",
      updatedUser: updatedUser,
      success: true
    });
  } else {
    return res.status(404).json({
      message: "User Not Found",
      success: false
    });
  }
});



export{
  createUser,
  userLogin,
  userLoggedOut,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById

}