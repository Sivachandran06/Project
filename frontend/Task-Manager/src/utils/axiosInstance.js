import axios from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance = axios.create({
    baseURL:BASE_URL,
    timeout:10000,
    headers:{
        "Content-type":"application/Json",
        Accept:"application/json",
    },
});

//Request Interceptor
axiosInstance.interceptors.request.use(
    (config)=>{
        const accessToken = localStorage.getItem("token");
        if(accessToken){
            config.headers.Authorization = `bearer ${accessToken}`;
        }
        return config;
    },(error)=>{
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response)=>{
        return response;
    },
    (error)=>{
        if(error.response){
            if(error.response.status === 401){
                //Redirect to login page
                window.location.href="/login";
            }else if (error.response.status === 500){
            console.error("Server error. Please try again Later.");
            }
        }else if( error.code ==="ECONNABORTED" ){
            console.error("Request timeout. please try again");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;