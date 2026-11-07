import { appAPI } from "../utils/validateEnvs";
import axios from "axios";
import { tokenManager } from "../lib/auth";

export const client=axios.create({
    baseURL:`${appAPI}/api`,
    withCredentials:true,// this is specials for sending cookies
    headers:{
        "Content-Type":"application/json",
        'Accept':'application/json'
    },
});

//Response interceptor for handling errors

client.interceptors.request.use(
(config)=>{
    const token=tokenManager.getToken();
    if(token){
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
},(error)=>{
    return Promise.reject(error);
}
);

//Add Response interceptor for handling errors(you were missing this)
client.interceptors.response.use(
    (response)=>{
        return response;
    },
    (error)=>{
        if(error.response?.status===401){
            //handle unauthorized error (optional)

            tokenManager.removeToken();
            window.location.href='/auth/login';
        }
        return Promise.reject(error);
    }
);