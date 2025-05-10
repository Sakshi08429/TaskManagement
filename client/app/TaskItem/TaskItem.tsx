import React from 'react'
import { Task } from '@/utils/types';
import { formatTime } from "@/utils/utilities";
import { AiFillStar } from "react-icons/ai"; // or any other star icon
import { FiEdit } from "react-icons/fi"; // Importing edit icon
import { RiDeleteBin6Line } from "react-icons/ri"; // Importing trash icon

const star = <AiFillStar />;
const edit = <FiEdit />;
const trash = <RiDeleteBin6Line />;


interface TaskItemProps {
  task: Task;
}       
function TaskItem({task}: TaskItemProps) {

    const getPriorityColor = (priority: string) => {   
        switch(priority){
            case "low":
                return "text-green-500";
            case "medium":
                return "text-yellow-500";
            case "high":
                return "text-red-500";
            default:
                return "text-red-500";
        }
     }
  return (
    <div className="h-[16rem] px-4 py-3 flex flex-col gap-4 shadow-sm bg-[#f9f9f9]">
     <div>
        <h4 className="font-bold text-2xl">{task.title}</h4>
        <p>{task.description}</p>
        
        
        </div>       
        <div className="mt-auto flex justify-between items-center" >
        <p className="text-sm text-gray-400 ">{formatTime(task.createdAt)}</p>
        <p className={`text-sm font-bold ${getPriorityColor(task.priority)}`}> 
             {task.priority}</p>

             <div className="flex items-center gap-2">
               <div className="flex items-center gap-3 text-gray-400 text-[1.2rem]">
                 <button className={`${task.completed ? "text-green-500" : "text-gray-400"}`}

                >{star}</button>
                <button className="text-[#00A1F1]">{edit}</button>
                <button className="text-red-500">{trash}</button>

               </div>
             </div>
            
             </div>
     
      
    </div>
  )
}

export default TaskItem;
