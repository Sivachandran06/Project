import React from "react";

const DeleteAlert = ({content, onDelete}) =>{
    return(
        <div>
            <p className="">{content}</p>

            <div className="flex justify-end mt-6">
                <button
                    type="button"
                    className="flex items-center gap-1.5 text-xs md:text-sm font-medium text-rose-500 whitespace-nowarp bg-rose-50 border-rose-100 rounded-lg px-4 py-2 cursor-ponter"
                    onClick={onDelete}
                    >
                        Delete
                </button>
            </div>
        </div>
    )
}
export default DeleteAlert;