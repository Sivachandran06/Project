import React, { useContext } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../componanets/Layouts/DashboardLayout";

const UserDashboard =()=>{
    useUserAuth();

    const {user} = useContext(UserContext);
    return<DashboardLayout> Dashboard</DashboardLayout>
}
export default UserDashboard;