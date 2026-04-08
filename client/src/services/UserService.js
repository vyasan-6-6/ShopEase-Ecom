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
        return makeRequest(userClient,{
            url:`user/addresses/${addressId}/default`,
            method:'PATCH'
        })
    },
    uploadAvatar:(formData)=>{
        return makeRequest(userClient,{
             url: "/user/avatar",
            method: "POST",
            data: formData, // The multipart/form-data payload
              headers: {
                "Content-Type": "multipart/form-data",
            },
        })
    }

};
