"use client";
import { useTasks } from "@/context/taskContext";
import { useUserContext } from "@/context/userContext";
import Image from "next/image";
import React from "react";

function Profile() {
  const { user } = useUserContext();
  const { tasks, activeTasks, completedTasks, openProfileModal } = useTasks();

  const photoSrc =
    user?.photo && user.photo.startsWith("http")
      ? user.photo
      : "/logo.png"; // fallback image

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      {/* Avatar and greeting */}
      <div
        className="flex items-center gap-4 cursor-pointer hover:bg-gray-100 p-3 rounded-lg transition"
        onClick={openProfileModal}
      >
        <Image
          src={photoSrc}
          alt="avatar"
          width={70}
          height={70}
          className="rounded-full"
        />
        <div>
          <p className="text-sm text-gray-500">Hello,</p>
          <p className="text-lg font-semibold text-gray-800">{user?.name}</p>
        </div>
      </div>

      {/* Task stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 text-gray-600">
        <div>
          <p className="text-sm">Total Tasks:</p>
          <div className="flex items-center gap-2 pl-3 relative">
            <span className="absolute left-0 h-6 w-1 bg-purple-500 rounded"></span>
            <span className="text-2xl font-bold text-gray-800 ml-3">
              {tasks.length}
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm">In Progress:</p>
          <div className="flex items-center gap-2 pl-3 relative">
            <span className="absolute left-0 h-6 w-1 bg-teal-500 rounded"></span>
            <span className="text-2xl font-bold text-gray-800 ml-3">
              {activeTasks.length}
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm">Open Tasks:</p>
          <div className="flex items-center gap-2 pl-3 relative">
            <span className="absolute left-0 h-6 w-1 bg-orange-400 rounded"></span>
            <span className="text-2xl font-bold text-gray-800 ml-3">
              {activeTasks.length}
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm">Completed:</p>
          <div className="flex items-center gap-2 pl-3 relative">
            <span className="absolute left-0 h-6 w-1 bg-green-500 rounded"></span>
            <span className="text-2xl font-bold text-gray-800 ml-3">
              {completedTasks.length}
            </span>
          </div>
        </div>
      </div>

      {/* Activity Header */}
      <h3 className="mt-8 font-medium text-gray-700">Activity</h3>
    </div>
  );
}

export default Profile;
