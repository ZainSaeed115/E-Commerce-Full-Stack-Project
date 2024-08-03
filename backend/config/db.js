
import mongoose from "mongoose";
import {DATABASE_NAME} from "../Constant.js"
const connectDB=async ()=>{
   try {
     const connectionInstance=await mongoose.connect(`${process.env.MONGODB_URI}/${DATABASE_NAME}`)
     console.log(`Successfully Connected with Mongodb😊 at Host:${connectionInstance.connection.host}`)
    
   } catch (error) {
      console.log(`Error:${error.message}`)
   }
}

export default connectDB;