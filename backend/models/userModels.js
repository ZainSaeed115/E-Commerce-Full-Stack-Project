import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema=mongoose.Schema({
    userName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        required:true,
        default:false
    },
    refreshToken:{
        type:String
       }


},
{timestamps:true}
)

// hasing the password
userSchema.pre("save",async function(next){
   if(!this.isModified("password")) return next()
    this.password= await bcrypt.hash(this.password,10)
})

// password validation
userSchema.methods.isPasswordCorrect=function(password){
  return bcrypt.compare(password,this.password)
}

// generate access tokens

 userSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
         expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
 }

 // generate refresh token

 userSchema.methods.generateRefreshToken=function(){
    return  jwt.sign({
        _id:this._id,
      
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}



const User=mongoose.model('User',userSchema);

export default User;