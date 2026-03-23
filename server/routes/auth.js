const express = require("express");

const router = express.Router();

router.get("/u",async (req,res)=>{
res.json("hi vyasan")
});

// router.post("/register");
// router.post("/login");

// router.get("/me");
// router.put("/profile");
// router.put("/change-password");
// router.post("/logout");

module.exports=router;