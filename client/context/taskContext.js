"use client";
import axios from "axios";
import React, { createContext, useEffect, useState } from "react";
import { useUserContext } from "./userContext";
import toast from "react-hot-toast";

const TasksContext = createContext();

const serverUrl = "http://localhost:5000/api/v1";

export const TasksProvider = ({ children }) => {
  const { user } = useUserContext();
  const userId = user?._id;

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [task, setTask] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [priority, setPriority] = useState("all");
  const [activeTask, setActiveTask] = useState(null);
  const [modalMode, setModalMode] = useState("");
  const [profileModal, setProfileModal] = useState(false);

  const openModalForAdd = () => {
    setModalMode("add");
    setIsEditing(true);
    setTask({});
  };

  const openModalForEdit = (task) => {
    setModalMode("edit");
    setIsEditing(true);
    setActiveTask(task);
  };

  const openProfileModal = () => {
    setProfileModal(true);
  };

  const closeModal = () => {
    setIsEditing(false);
    setProfileModal(false);
    setModalMode("");
    setActiveTask(null);
    setTask({});
  };

  // Get tasks
  const getTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/tasks`);
      setTasks(response.data.tasks);
    } catch (error) {
      console.log("Error getting tasks", error);
      toast.error("Failed to load tasks");
    }
    setLoading(false);
  };

  // Get a single task
  const getTask = async (taskId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${serverUrl}/task/${taskId}`);
      setTask(response.data);
    } catch (error) {
      console.log("Error getting task", error);
      toast.error("Failed to load task");
    }
    setLoading(false);
  };

  // Create a task
  const createTask = async (task) => {
    setLoading(true);
    try {
      const res = await axios.post(`${serverUrl}/task/create`, task);
      setTasks([...tasks, res.data]);
      toast.success("Task created successfully");
    } catch (error) {
      console.log("Error creating task", error);
      toast.error("Failed to create task");
    }
    setLoading(false);
  };

  // Update a task
  const updateTask = async (task) => {
    setLoading(true);
    try {
      const res = await axios.patch(`${serverUrl}/task/${task._id}`, task);
      const updatedTasks = tasks.map((tsk) =>
        tsk._id === res.data._id ? res.data : tsk
      );
      toast.success("Task updated successfully");
      setTasks(updatedTasks);
    } catch (error) {
      console.log("Error updating task", error);
      toast.error("Failed to update task");
    }
    setLoading(false);
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    setLoading(true);
    try {
      await axios.delete(`${serverUrl}/task/${taskId}`);
      const updatedTasks = tasks.filter((tsk) => tsk._id !== taskId);
      setTasks(updatedTasks);
      toast.success("Task deleted successfully");
    } catch (error) {
      console.log("Error deleting task", error);
      toast.error("Failed to delete task");
    }
    setLoading(false);
  };

  const handleInput = (name) => (e) => {
    if (name === "setTask") {
      setTask(e);
    } else {
      setTask({ ...task, [name]: e.target.value });
    }
  };

  // Get completed tasks
  const completedTasks = tasks.filter((task) => task.completed);

  // Get pending tasks
  const activeTasks = tasks.filter((task) => !task.completed);

  useEffect(() => {
    if (userId) {
      getTasks();
    }
  }, [userId]);

  return (
    <TasksContext.Provider
      value={{
        tasks,
        loading,
        task,
        getTask,
        createTask,
        updateTask,
        deleteTask,
        priority,
        setPriority,
        handleInput,
        isEditing,
        setIsEditing,
        openModalForAdd,
        openModalForEdit,
        activeTask,
        closeModal,
        modalMode,
        openProfileModal,
        activeTasks,
        completedTasks,
        profileModal,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  return React.useContext(TasksContext);
};
