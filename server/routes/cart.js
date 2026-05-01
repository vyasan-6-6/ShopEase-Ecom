const express = require("express");
const CartController = require("../controllers/CartController");
const { authenticateUser } = require("../middlewares/auth");

const router = express.Router();

// All cart routes require authentication
router.use(authenticateUser);

router.get("/", CartController.getCart);
router.post("/add", CartController.addToCart);
router.put("/update", CartController.updateQuantity);
router.delete("/remove/:productId", CartController.removeFromCart);
router.delete("/clear", CartController.clearCart);

module.exports = router;
