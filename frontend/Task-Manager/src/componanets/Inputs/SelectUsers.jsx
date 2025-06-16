import React, { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { LuUsers } from "react-icons/lu";

const SelectUsers = ({selectedUsers,setSelectedUsers})=>{
    const [allUsers, setAllUsers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tempSelectedUsers, setTempSelectedUseers] = useState([]);

    const getAllUsers = async()=>{
        try{
            const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
            if(response.data?.length >0){
                setAllUsers(response.data);
            }
        }catch(error){
            console.log("Error fetching users:", error);
        }
    };

    const toggleUserSelection = (userId) =>{
        setTempSelectedUseers((prev)=>
        prev.includes(userId)
        ? prev.filter((id)=> id !== userId)
        : [...prev, userId]
        );
    };

    const handelAssign = ()=>{
        setSelectedUsers(tempSelectedUsers);
        setIsModalOpen(false);
    };

    const selectedUserAvatars = allUsers
        .filter((user)=> selectedUsers.includes(user._id))
        .map((user)=> user.profileImageUrl);

        useEffect(()=>{
            if(selectedUsers.length === 0){
                setTempSelectedUseers([]);
            }

            return()=>{};
        },[selectedUsers]);
    
    return<div className="space-y-4 mt-2">
        {selectedUserAvatars.length === 0 && (
            <button className="card-btn" onClick={()=> setIsModalOpen(true)}>
                <LuUsers className="text-sm"/> Add Memebers
            </button>
        )}
    </div>
}
export default SelectUsers;