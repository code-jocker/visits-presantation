import type { User } from "../api/auth";

export interface AuthContext{
    isAuthenticated: boolean;
    user:User|null;
    isLoading:boolean;
}

// token management for faster auth checks
export const tokenManager={
    getToken:():string|null=>{
        return localStorage.getItem('token')|| sessionStorage.getItem('token');
    },
    saveToken:(token:string,remember:boolean=false):void=>{
        if(remember){
            localStorage.setItem('token',token);
             sessionStorage.removeItem('token');
        }
        else{
            sessionStorage.setItem('token', token);
            localStorage.removeItem('token');
        }
    },
    removeToken:():void=>{
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
    },

    hasToken:():boolean=>{
        return !!(localStorage.getItem('token')|| sessionStorage.getItem('token'));
    }
    
};