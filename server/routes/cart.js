const express = require("express");
const CartController = require("../controllers/CartController");
const { authenticateAnyUser, authenticateUser } = require("../middlewares/auth");

const router = express.Router();

// All cart routes require authentication (works for both User and Admin)
router.use(authenticateAnyUser);

router.get("/", CartController.getCart);
router.post("/add", CartController.addToCart);
router.put("/update", CartController.updateQuantity);
router.delete("/remove/:productId", CartController.removeFromCart);
router.delete("/clear", CartController.clearCart);
router.post("/merge",authenticateUser, CartController.mergeCart);

module.exports = router;
