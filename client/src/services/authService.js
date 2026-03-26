import {makeRequest,tokenService,userClient} from "../utils/apiClient";

export const authAPI = {
    resgister:async (data)=>{
        return makeRequest(userClient,{
            url:"/auth/register",
            method:"POST",
            data
        });
    },

    verifyRegisterOtp:async(data)=>{
const res = await makeRequest(userClient,{
    url:"/auth/verify-otp",
    method:'POST',
    data
});

if(res?.token){
    tokenService.setAuthToken(res.token);
}
return res;
    },

    login:async (credential)=>{
        const res = await makeRequest(userClient,{
            url:'/auth/login',
            method:'POST',
            data:credential,
        });
        if(res?.token){
            tokenService.setAuthToken(res.token);
        }
        return res;
    }
}