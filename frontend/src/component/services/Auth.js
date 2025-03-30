import { getUserData, removeUserData,getAdminData, removeAdminData } from "./storage";

export const isAuthenticated = ()=>{
    return getUserData()!=null?true:false;
}

export const isAdminAuthenticated = ()=>{
    return getAdminData()!=null?true:false;
}

export const logout = ()=>{
    removeUserData();
}

export const Alogout = ()=>{
    removeAdminData();
}