const multer =require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads"); // We will save it locally in the server/uploads floor
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    // Real-world e-commerce checks!
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only .jpeg, .jpg, .png and .webp formats allowed!"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
   limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});

module.exports=upload;