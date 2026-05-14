const Wallet = require("../models/Wallet");
 

class WalletService {
    static async getWallet(userId) {
        let wallet = await Wallet.findOne({ user: userId });
        if (!wallet) {
            wallet = await Wallet.create({ user: userId, balance: 0, transactions: [] });
        }
        return wallet;
    }

    static async addFunds(userId, amount, description, orderId = null) {
        let wallet = await Wallet.findOne({ user: userId });
        if (!wallet) {
            wallet = await Wallet.create({ user: userId, balance: 0, transactions: [] });
        }
        
        wallet.balance += amount;
        wallet.transactions.push({
            amount,
            type: amount > 0 ? 'Credit' : 'Debit',
            description,
            orderId
        });
        await wallet.save();
        return wallet;
    }
}

module.exports = WalletService;
