const fs = require('fs');
const {v2:cloudinary} = require('cloudinary');
const config = require('../config/config');

cloudinary.config(config.CLOUDINARY);

const uploadToCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        
        // Upload to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: "shopease_avatars",
        });
        
        // File uploaded securely to the cloud, remove local temporary copy
        fs.unlinkSync(localFilePath);
        return response;
        
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        // Remove the locally saved temporary file as the upload operation failed
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
        return null;
    }
};

module.exports={uploadToCloudinary};


// flow 
// ---------
// User uploads file → stored locally (temp)
//          |
// You upload to Cloudinary
//          |
// Get secure_url
//          |
// Delete local file
//          |
// Save URL in DB