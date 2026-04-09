import { makeRequest, tokenService, userClient } from "../utils/apiClient";

export const authAPI = {
    register: async (data) => {
        return makeRequest(userClient, {
            url: "/auth/register",
            method: "POST",
            data,
        });
    },

    verifyRegisterOtp: async (data) => {
        const res = await makeRequest(userClient, {
            url: "/auth/verify-otp",
            method: "POST",
            data,
        });

        if (res?.token) {
            tokenService.setAuthToken(res.token);
        }
        return res;
    },

    login: async (credential) => {
        const res = await makeRequest(userClient, {
            url: "/auth/login",
            method: "POST",
            data: credential,
        });
        if (res?.data?.token) {
            tokenService.setAuthToken(res?.data?.token);
            console.log("authToken set in apiclient:",res.data.token);
        }
        return res;
    },

    getProfile: async () => {
         
        return makeRequest(userClient, {
            url: "auth/getProfile",
            method: "GET",
        });
    },

    logout: async () => {
        try {
            await makeRequest(userClient, {
                url: "/auth/logout",
                method: "POST",
            });
        } catch (error) {}
        tokenService.clearAll();
    },

    forgotPassword: async (email) => {
        return makeRequest(userClient, {
            url: "/auth/forgot-password",
            method: "POST",
            data:  {email },
        });
    },

    verifyResetOtp: async (data) => {
        return makeRequest(userClient, {
            url: "/auth/verify-reset-otp",
            method: "POST",
            data,
        });
    },
    resendOtp:async(data)=>{
        return makeRequest(userClient,{
            url:"/auth/resend-otp",
            method:'POST',
            data
        })
    }
    ,
    
    resetPassword: async (data) => {
        return makeRequest(userClient, {
            url: "/auth/reset-password",
            method: "POST",
            data,
        });
    },
    updateProfile: async (data) => {//in userservice
        return makeRequest(userClient, {
            url: "/profile",
            method: "PUT",
            data,
        });
    },

    changePassword: async (data) => {//in userservice
        return makeRequest(userClient, {
            url: "/change-password",
            method: "POST",
            data,
        });
    },
};
