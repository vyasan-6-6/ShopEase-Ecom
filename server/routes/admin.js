const express = require('express');
const AdminController = require('../controllers/AdminController');

const router = express.Router();

router.post("/login",AdminController.login);
// router.get("/users");
// router.get("/users/:id");
// router.put("/users/:id");
// router.post("/users/:id/ban");
// router.post("/users/:id/unban");
// router.post("/users/:id/force-logout");
// router.patch("/users/:id/status");
// router.get("/stats");
module.exports=router