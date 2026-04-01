import { adminClient, makeRequest, tokenService } from "../utils/apiClient"

export const adminApi = {
    // getDashboard :async ()=>{
    //     return makeRequest(adminClient,{
    //         url:"admin/getDashboard",
    //         method:'GET',
    //     });
    // },
    
    adminLogin :async (credentials)=>{
        const res = makeRequest(adminClient,{
            url:"admin/login",
            method:'POST',
            data:credentials,
        });
        if(res?.token) {
            tokenService.setAdminToken(res.token)
        }
        return res;
    }
}
 