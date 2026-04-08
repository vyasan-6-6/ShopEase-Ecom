const express = require("express");
const UserController = require("../controllers/UserController"); 
const { authenticateUser } = require("../middlewares/auth");
const upload = require("../middlewares/uploadMiddleware");
const router = express.Router();

router.use(authenticateUser); //By putting the middleware directly on the router, it automatically protects every single route defined below it.

router.get("/profile", UserController.getProfile);
router.patch("/profile", UserController.updateProfile);
router.post("/addresses",UserController.addAddresses);

// Multer's "upload.single('avatar')" looks for a file attached to the form data key "avatar"
router.post("/avatar", upload.single("avatar"), UserController.uploadAvatar);


module.exports = router;
