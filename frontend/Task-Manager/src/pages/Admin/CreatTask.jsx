import React, { useEffect, useState } from "react";
import DashboardLayout from "../../componanets/Layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../componanets/Inputs/SelectDropdown";
import SelectUsers from "../../componanets/Inputs/SelectUsers";
import TodoListInput from "../../componanets/Inputs/TodoListInput";
import AddAttachmentsInput from "../../componanets/Inputs/AddAttachmentsInput";
import DeleteAlert from "../../componanets/DeleteAlert";
import Modal from "../../componanets/Layouts/Modal";

const CreatTask = ()=>{

    const location = useLocation();
    const { taskId } = location.state || {};
    console.log("TASK ID IS", taskId);
    const navigate = useNavigate();

    const [taskData, setTaskData]= useState({
        title: "",
        description:"",
        priority: "Low",
        dueDate: null,
        assignedTo:[],
        todoCheckList:[],
        attachment: [],
    });

    const [currentTask, setCurrentTask] = useState(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

    const handelValueChange = (key, value)=>{
        setTaskData((prevData)=>({...prevData, [key]:value}));
    };

    const clearData = ()=>{

        //reset form
        setTaskData({
            title:"",
            description:"",
            priority:"Low",
            dueDate: null,
            assignedTo:[],
            attachment:[],
            todoCheckList:[],
        })
    };

    //Create Task
    const createTask = async()=>{
        setLoading(true);
        try{
            const todoList = taskData.todoCheckList?.map((item)=>({
                text: item,
                completed: false
            }));

            const response = await axiosInstance.post(API_PATHS.TASKS.CREATE_TASK,{
                ...taskData,
                dueDate:new Date(taskData.dueDate).toISOString(),
                todoCheckList: todoList,
            });
            toast.success("Task Created Successfully");

            clearData();
        } catch (error){
            console.log("error creating task:", error);
            setLoading(false);
        }finally{
            setLoading(false);
        }
    };

    //Update Task
    const updateTask = async()=>{
        setLoading(true);

        try{
            const todolist = taskData.todoCheckList?.map((item)=>{
                const prevtodoCheckList = currentTask?.todoCheckList || [];
                const matchedTask = prevtodoCheckList.find((task)=>task.text == item);

                return{
                    text: item,
                    completed: matchedTask ? matchedTask.completed : false,
                };
            });

            const response = await axiosInstance.put(API_PATHS.TASKS.UPDATE_TASK(taskId),
            {
                ...taskData,
                dueDate: new Date(taskData.dueDate).toISOString(),
                todoCheckList: todolist
            }
        );

        toast.success("Task Update sucessfully");
        }catch(error){
            console.error("Error creating task:", error)
            setLoading(false);
        }finally{
            setLoading(false);
        }
    };

    const handelSubmit = async()=>{
        setError(null);

        //Input validation
        if(!taskData.title.trim()){
            setError("title is required.");
            return;
        }
        if(!taskData.description.trim()){
            setError("Description is required.");
            return;
        }
        if(!taskData.dueDate){
            setError("Due date is required.")
            return;
        }
        if(taskData.assignedTo?.length === 0){
            setError("Task not assigned to any Member");
            return;
        }
        if(taskData.todoCheckList?.length === 0){
            setError("Add atleast one todo task");
            return
        }
        if(taskId){
            updateTask();
            return;
        }
        createTask();
    };

    //Get Task info by ID
    const getTaskDetailsByID = async()=>{
        try{
            const response = await axiosInstance.get(API_PATHS.TASKS.GET_TASK_BY_ID(taskId));
            console.log(taskId, "TaskId")
            if(response.data){
                const taskInfo = response.data;
                setCurrentTask(taskInfo);

                setTaskData((prevState)=>({
                    title: taskInfo.title,
                    description:taskInfo.description,
                    priority: taskInfo.priority,
                    dueDate: taskInfo.dueDate
                    ?moment(taskInfo.dueDate).format("YYYY-MM-DD")
                    : null,
                    assignedTo:taskInfo?.assignedTo?.map((item)=>item._id) || [],
                    todoCheckList:
                        taskInfo?.todoCheckList?.map((item)=> item?.text) || [],
                    attachment:taskInfo.attachment || [],
                }));
            }
        }catch(error){
            console.error("Error fetching users:", error);
        }
    };

    //Delete Task
    const deleteTask = async()=>{
        try{
            await axiosInstance.delete(API_PATHS.TASKS.DELETE_TASK(taskId));

            setOpenDeleteAlert(false);
            toast.success("Expense details deleted successfully");
            navigate(`/admin/tasks`)
        }catch(error){
            console.error(
                "Error deleting expence",
                error.response?.data?.message || error.message
            );
        }
    };

    useEffect(()=>{
        if(taskId){
            getTaskDetailsByID(taskId)
            
        }
        return()=>{}
    },[taskId])
    return(
        <>
        <DashboardLayout activeMenu={"Create Task"}> 
        <div className="mt-5">
            <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
                <div className="form-card col-span-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl md:text-xl font-medium">
                            {taskId ? "Update Task" : "Create Task"}
                        </h2>
                        {taskId && (
                            <button className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 px-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                                    onClick={()=> setOpenDeleteAlert(true)}
                            >
                                <LuTrash2 className="text-base"/> Delete
                            </button>
                        )}
                    </div>

                    <div className="mt-4">
                        <label className="text-xs font-medium text-slate-1000">
                            Task title
                        </label>

                        <input 
                            placeholder="Create App UI"
                            className="form-input"
                            value={taskData.title}
                            onChange={({target})=>
                            handelValueChange("title", target.value)
                        }
                        />
                    </div>
                    <div className="mt-3">
                        <label className="text-xs font-medium text-slate-1000">
                            Description
                        </label>

                        <textarea
                            placeholder="Describe Task"
                            className="form-input"
                            rows={4}
                            value={taskData.description}
                            onChange={({target})=>
                                handelValueChange("description", target.value)
                            }
                        />
                    </div>
                    <div className="grid grid-cols-12 gap-4 mt-2">
                        <div className="col-span-6 md:col-span-4">
                            <label className="text-xs font-medium text-slate-1000">
                                Priority
                            </label>

                            <SelectDropdown
                                options = {PRIORITY_DATA}
                                value = {taskData.priority}
                                onChange = {(value) =>handelValueChange("priority", value)}
                                placeholder = "Select Priority"
                            />
                        </div>

                        <div className="col-span-6 md:col-span-4">
                            <label className="text-xs font-medium text-slate-1000">
                                Due Date
                            </label>

                            <input
                                placeholder="Create App UI"
                                className="form-input"
                                value={taskData.dueDate || []}
                                onChange={({target})=> handelValueChange("dueDate",target.value)
                            }
                            type="date"
                            />
                        </div>
                        <div className="col-span-12 md:col-span-3">
                            <label className="text-xs font-medium text-slate-1000">
                                Assign To
                            </label>

                            <SelectUsers
                                selectedUsers = {taskData.assignedTo}
                                setSelectedUsers = {(value)=>{
                                handelValueChange("assignedTo", value);
                                }}
                            />
                        </div>
                    </div>
                    <div className="mt-3">
                        <label className="text-xs font-medium text-slate-1000">
                            TODO Checklist
                        </label>

                        <TodoListInput
                            todoList = {taskData?.todoCheckList}
                            setTodoList = {(value)=>handelValueChange("todoCheckList", value)
                            }
                        />
                    </div>

                    <div className="mt-3">
                        <label className="text-xs font-medium text-slate-1000">
                            Add Attachments
                        </label>

                        <AddAttachmentsInput
                            attachment = {taskData?.attachment}
                            setattachment = {(value)=>
                                handelValueChange("attachment", value)
                            }
                        />
                    </div>

                    {error && (
                        <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
                    )}

                    <div className="flex justify-end mt-7">
                        <button
                            type="button"
                            className="add-btn"
                            onClick={handelSubmit}
                            disabled = {loading}
                        >
                            {taskId ? "UPDATE TASK": "CREATE TASK"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <Modal
            isOpen = {openDeleteAlert}
            onClose = {()=>setOpenDeleteAlert(false)}
            title = "Delete Task"
        >
            <DeleteAlert
                content= "Are you sure you want to delete this task ?"
                onDelete={()=>deleteTask()}
            />
        </Modal>
        
        </DashboardLayout>
        </>
    )
}
export default CreatTask;
