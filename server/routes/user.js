const express = require("express");
const UserController = require("../controllers/UserController");
const { verifyUserToken } = require("../utils/jwt");
const router = express.Router();

router.use(verifyUserToken); //By putting the middleware directly on the router, it automatically protects every single route defined below it.

router.patch("/profile", UserController.updateProfile);

module.exports = router;
