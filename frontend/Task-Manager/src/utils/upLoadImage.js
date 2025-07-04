import { API_PATHS } from "./apiPath";
import axiosInstance from "./axiosInstance";


const uplodaImage = async(imageFile)=>{
    const formData = new FormData();
    //append image file to form data
    formData.append('image',imageFile);

    try{
        const responce = await axiosInstance.post(API_PATHS.IMAGE.UPLOAD_IMAGE, formData,{
            headers:{
                'Content-Type': 'multipart/form-data', // set header for file upload
            },
        });
        return responce.data; // Return response data
    }catch(error){
        console.error("Error uploading the image:",error);
        throw error; // Rethrow error for handling
    }
};

export default uplodaImage;