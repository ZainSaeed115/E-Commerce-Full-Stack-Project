import express from "express";

import cors from "cors"
import cookieParser from "cookie-parser";

const app= express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


// import routes
import userRoutes from "./routes/userRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"

app.use("/api/v1/user",userRoutes)
app.use("/api/v1/category",categoryRoutes)
app.get('/',(req,res)=>{
    res.send("Hello")
})

export{app}