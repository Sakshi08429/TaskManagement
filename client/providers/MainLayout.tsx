
"use client";
import Modal from "@/app/Components/Modal/Modal";
import ProfileModal from "@/app/Components/Profile/ProfileModal";
import { useTasks } from "@/context/taskContext";
import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

function MainLayout({ children }: MainLayoutProps) {
  const { isEditing, profileModal } = useTasks();

  return (
    <div className="main-layout flex h-full w-full bg-[#EDEDED] border-2 border-white rounded-[1.5rem] overflow-hidden">
      {/* Left Section - Tasks */}
      <div className="flex-1 p-4 overflow-auto">{children}</div>

      {/* Right Section - Profile Sidebar */}
      <div className="w-[20rem] border-l border-gray-300 p-4 overflow-auto">
        {/* You can conditionally mount the Profile Sidebar content here */}
        {profileModal && <ProfileModal />}
      </div>

      {/* Modals on top */}
      {isEditing && <Modal />}
    </div>
  );
}

export default MainLayout;
