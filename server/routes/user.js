const express = require("express");
const UserController = require("../controllers/UserController"); 
const { authenticateUser } = require("../middlewares/auth");
const router = express.Router();

router.use(authenticateUser); //By putting the middleware directly on the router, it automatically protects every single route defined below it.

router.get("/profile", UserController.getProfile);
router.patch("/profile", UserController.updateProfile);
router.post("/addresses",UserController.addAddresses);

module.exports = router;
