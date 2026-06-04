const express = require("express");
const WalletController = require("../controllers/WalletController");
const { authenticateUser } = require('../middlewares/auth');
const router = express.Router();

router.use(authenticateUser);
router.get("/", WalletController.getWallet);

module.exports = router;
