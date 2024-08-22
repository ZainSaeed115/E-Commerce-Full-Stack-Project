import dotenv from "dotenv"
import connectDB from "./config/db.js"
import { app } from "./App.js"
import {DATABASE_NAME} from "./Constant.js"

dotenv.config(
    {
        path:'./.env'
    }
)


const port =process.env.PORT || 8000

app.get((req,res)=>{
    res.send("Hello")
})
connectDB()
.then(
    ()=>{
        app.listen(port,()=>{
            console.log(`Server running on port:${port}`)
           
        })
    }
)
.catch((error)=>{
    console.log("Mongodb Connection Failed😯",error)
})