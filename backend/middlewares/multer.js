import path from 'path'
import express from 'express'
import multer from 'multer'
const storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./public/temp")

    },
    filename:function(req,file,cb){
       
        cb(null,file.originalname);
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




export const upload=multer({
    storage,fileFilter 
})