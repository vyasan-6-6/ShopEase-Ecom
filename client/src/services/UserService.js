import { makeRequest, tokenService, userClient } from "../utils/apiClient";

export const userApi = {
    updateProfile: (data) => {
        return makeRequest(userClient, {
            url: "/user/profile",
            method: "PATCH",
            data: data,
        });
    },
    getProfile: () => makeRequest(userClient, { url: "/user/profile", method: "GET" }),
    addAddress:(addressData)=> {
return makeRequest(userClient,{
    url:'/user/address',
    method:'POST',
    data:addressData
})
    },
    setDefaultAddress:(addressId)=>{
        return makeRequest(userApi,{
            url:`user/address/${addressId}/default`,
            method:'PATCH'
        })
    }
};
