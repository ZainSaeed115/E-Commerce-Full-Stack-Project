import express from "express";

import cors from "cors"
import cookieParser from "cookie-parser";
import path from "path"
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
import productRoutes from "./routes/productRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import formidable from "express-formidable";
app.use("/api/v1/user",userRoutes)
app.use("/api/v1/category",categoryRoutes)
app.use("/api/v1/product",productRoutes)
app.use("/api/v1/upload",uploadRoutes)
app.use("/api/v1/order",orderRoutes)
app.use(formidable({
    multiples: true, // Support multiple files upload
    uploadDir: "./public/temp", // Directory to save files
    keepExtensions: true // Keep file extensions
}));


// const __dirname=path.resolve();
// app.use("/uploads",express.static(path.join(__dirname+"/uploads")))

app.get('/',(req,res)=>{
    res.send("Hello")
})

export{app}