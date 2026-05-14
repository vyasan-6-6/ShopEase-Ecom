import { userClient, makeRequest } from "../utils/apiClient";

const WalletService = {
    getWallet: () => {
        return makeRequest(userClient, {
            method: "GET",
            url: "/wallet",
        });
    }
}

export default WalletService;
