import { makeRequest, tokenService, userClient } from "../utils/apiClient";

export const userApi = {
    updateProfile: (data) => {
        return makeRequest(userClient, {
            url: "/user/profile",
            method: "PATCH",
            data: data,
        });
    }, 
    addAddress:(addressData)=> {
return makeRequest(userClient,{
    url:'/user/addresses',
    method:'POST',
    data:addressData
})
    },
    setDefaultAddress:(addressId)=>{
        return makeRequest(userApi,{
            url:`user/addresses/${addressId}/default`,
            method:'PATCH'
        })
    }
};
