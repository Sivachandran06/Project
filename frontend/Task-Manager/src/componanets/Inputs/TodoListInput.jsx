import React, { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { HiMiniPlus } from "react-icons/hi2";

const TodoListInput =({todoList, setTodoList})=>{
    const [option, setOption]= useState("");

    //Function to handle adding an option
    const handleAddOption =()=>{
        if(option.trim()){
            setTodoList([...todoList, option.trim()]);
            setOption("");
        }
    };

    //function to handle deleting an option
    const handelDeleteOption = (index)=>{
        const updateArr = todoList.filter((_,idx)=>idx !== index);
        setTodoList(updateArr);
    };

    return(
        <div>
            {todoList.map((item, index)=>(
                <div
                    key={item}
                    className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
                >
                    <p className="test-xs text-black">
                        <span className="text-xs text-gray-400 font-semibold mr-2">
                            {index < 9 ? `0${index +1}`: index +1}
                        </span>
                        {item}
                    </p>

                    <button
                        className="cursor-pointer"
                        onClick={()=>{
                            handelDeleteOption(index);
                        }}
                    >
                        <HiOutlineTrash className="text-lg text-red-500"/>
                    </button>
                </div>
            ))}
            <div className="flex items-center gap-5 mt-4">
                <input
                    type="text"
                    placeholder="Enter Task"
                    value={option}
                    onChange={({target})=> setOption(target.value)}
                    className="w-full text-[13px] text-black outline-none bg-white border border-gray-300 px-3 py-2 rounded-md"
                />

                <button className="card-btn text-nowarp" onClick={handleAddOption}>
                    <HiMiniPlus className = "text-lg"/> Add
                </button>
            </div>
        </div>
    )
}
export default TodoListInput;