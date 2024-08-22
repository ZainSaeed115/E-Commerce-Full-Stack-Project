import path from 'path'
import express from 'express'
import multer from 'multer'

const router= express.Router();


const storage=multer.diskStorage({

    destination:(req,file,cb)=>{
        cb(null,"./public/temp");
    },

    filename:(req,file,cb)=>{
        const extname=path.extname(file.originalname)
        cb(null,`${file.originalname}-${Date.now()}${extname}`)
    }
})


const fileFilter = (req, file, cb) => {
    const fileTypes = /jpe?g|png|webp/;
    const mimeTypes = /image\/jpe?g|image\/png|image\/webp/;

    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = mimeTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Images Only"), false);
    }
};



const upload= multer({storage,fileFilter})
const uploadSingleImage=upload.single('image')

router.post('/',(req,res)=>{
    uploadSingleImage(req,res,(err)=>{
        if(err){
            return res.status(400).send({message:err.message})
        }
        console.log("Uploaded File Info:", req.file);
         if(req.file){
            return res.status(200).send({
                message:"Image uploaded successfully",
                image:`${req.file.filename}`
            })
        }
        else{
            return res.status(400).send({message:"No image file provided"});
        }
    })
})

export default router;