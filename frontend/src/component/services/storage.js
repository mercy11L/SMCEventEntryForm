
export const storeUserData = (data)=>{
    localStorage.setItem("token",data);
}

export const getUserData = ()=>{
    return localStorage.getItem("token");
}

export const removeUserData = ()=>{
    localStorage.removeItem("token");
}

export const storeAdminData = (data)=>{
    localStorage.setItem("admin",data);
}

export const getAdminData = ()=>{
    return localStorage.getItem("admin");
}

export const removeAdminData = ()=>{
    localStorage.removeItem("admin");
}