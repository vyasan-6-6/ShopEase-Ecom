const WalletService = require("../services/WalletService");
const BaseController = require("./BaseController");

class WalletController extends BaseController {
    static getWallet = BaseController.asyncHandler(async (req, res) => {
        const wallet = await WalletService.getWallet(req.user.id);
        BaseController.sendSuccess(res, "Wallet fetched successfully", { wallet }, 200);
    });
}

module.exports = WalletController;
