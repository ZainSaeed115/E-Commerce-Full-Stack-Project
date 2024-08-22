import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config(
    {
        // cloud_name: process.env.CLOUD_NAME, 
        // api_key: process.env.API_KEY, 
        // api_secret: process.env.API_SECRET

        cloud_name: 'ecomercestore', 
        api_key: '848829175385392', 
        api_secret: 'ZacqOHU5eJ0I9GZEWMH5g3cwviE'
    }
);

  

const uploadFileOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "image"
        });

        try {
            fs.unlinkSync(localFilePath); // Remove local file
        } catch (unlinkError) {
            console.error("Error deleting local file:", unlinkError.message);
        }

        return response;
    } catch (error) {
        try {
            fs.unlinkSync(localFilePath); // Remove local file in case of error
        } catch (unlinkError) {
            console.error("Error deleting local file after upload error:", unlinkError.message);
        }
        console.error("Cloudinary upload error:", error.message);
        return null;
    }
};


export {uploadFileOnCloudinary}