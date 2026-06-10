const multer =require("multer");
const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const path = require("path");
const config = require("../config/config");

cloudinary.config(config.CLOUDINARY);

const storage = new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder: (req, file) => {
            // Dynamically assign folders based on the fieldname defined in routes
            if (file.fieldname === "avatar") return "shopease_avatars";
            if (file.fieldname === "images") return "shopease_products";
            if (file.fieldname === "image") return "shopease_banners";
            return "shopease_general";
        },
        allowed_formats: ["jpg", "jpeg", "png", "webp"]
    }

})
 
 

const upload = multer({
    storage, 
   limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});

module.exports=upload;