import { makeRequest, tokenService, userClient } from "../utils/apiClient";

const userApi = {
    updateProfile: (data) => {
        return makeRequest(userClient, {
            url: "/user/profile",
            method: "PUT",
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
            url:`/user/addresses/${addressId}/default`,
            method:'PATCH'
        })
    },
    deleteAddress: (addressId) => {
        return makeRequest(userClient, {
            url: `/user/addresses/${addressId}`,
            method: "DELETE",
        });
    },
    editAddress: (addressId, addressData) => { 
        return makeRequest(userClient, {
            url: `/user/addresses/${addressId}`,
            method: "PUT",
            data: addressData,
        });
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

export default userApi;
