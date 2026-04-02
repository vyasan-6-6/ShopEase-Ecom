 
import { adminClient, makeRequest, tokenService } from "../utils/apiClient"

export const adminApi = {
    getProfile :async ()=>{
        return  makeRequest(adminClient,{
            url:"admin/getProfile",
            method:'GET',
            
        });
    },
    
    adminLogin :async (credentials)=>{
        const res =await makeRequest(adminClient,{
            url:"admin/login",
            method:'POST',
            data:credentials,
        });
        if(res?.data?.token) {
            tokenService.setAdminToken(res?.data?.token);
        }
        return res;
    }
}
 