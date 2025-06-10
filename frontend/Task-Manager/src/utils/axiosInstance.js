import axios from "axios";
import { BASE_URL } from "./apiPath";

const axiosInstance = axios.create({
    baseURL:BASE_URL,
    timeout:10000,
    headers:{
        "Content-type":"application/json",
        Accept:"application/json",
    },
});

//Request Interceptor
axiosInstance.interceptors.request.use(
    (config)=>{
        const accessToken = localStorage.getItem("token");
        if(accessToken){
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response) => response,
  (error) => {
    if (error.response) {
      // Skip redirect for login page itself
      if (error.config.url.includes("/api/auth/login")) {
        return Promise.reject(error);
      }
      
      if (error.response.status === 401) {
        // Use navigation instead of full page reload
        window.location.href = "/login";
        localStorage.removeItem("token");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;