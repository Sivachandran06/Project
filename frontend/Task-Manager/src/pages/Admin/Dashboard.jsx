import React, { useContext, useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import DashboardLayout from "../../componanets/Layouts/DashboardLayout";
import { UserContext } from "../../context/userContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { useNavigate } from "react-router-dom";
import moment from 'moment';
const Dashboard = ()=>{
    useUserAuth();

    const {user} = useContext(UserContext);
    
        const navigate = useNavigate();
    
        const [dashboardData, setDashboardData] = useState(null);
        const [pieChartData, setPieChartdata]= useState([]);
        const [barChartdata, setBarChartData]= useState([]);
    
        const getDashboardData = async ()=>{
            try{
                const response = await axiosInstance.get(API_PATHS.TASKS.GET_DASHBOARD_DATA);
                console.log("Calling API:", API_PATHS.TASKS.GET_DASHBOARD_DATA);
                if(response.data){
                    setDashboardData(response.data)
                    console.log(response.data,"(response.data)")
                }
            }catch(error){
                console.error("error fetching User:", error);
            }
        };
        useEffect(()=>{
            getDashboardData();
    
            return ()=>{};
        },[]);
        return<DashboardLayout activeMenu={"Dashboard"}> 
            <div className="card my-5">
                <div>
                    <div className="col-span-3">
                        <h2 className="text-xl md:text-2xl">Good Morning! {user?.name}</h2>
                        <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
                            {moment().format("dddd DO MMM YYYY")}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
                    <InfoCard
                       icon ={<IoMdCard/>}
                       label="Total Tasks"
                       value= {addThousandsSeparator(
                        dashboardData?.charts?.taskDistribution?.All || 0
                       )}
                       color ="bg-primary"
                       />
                </div>
            </div>
        </DashboardLayout>

    }
export default Dashboard;