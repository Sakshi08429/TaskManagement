"use client"
import axios from "axios";
// import { getSupportedBrowsers } from "next/dist/build/utils";
import { useRouter } from "next/navigation"
import React, { createContext, useEffect, useState,useContext } from "react";
import toast from "react-hot-toast";

// Creating the context
const UserContext = React.createContext();

// Creating the provider component
export const UserContextProvider = ({ children }) => {

    const serverUrl="http://localhost:8000";
    const router=useRouter();
   const[user,setUser]=useState({});
   const [userState,setUserState]=useState({
    name:"",
    email:"",
    password:"",
   });

const [loading,setLoading]=useState(false);


//register user
const registerUser=async(e)=>{
e.preventDefault();
if(!userState.email.includes("@")||
    !userState.password||
    userState.password.length<6){
    toast.error("Please enter valid email and password (min 6 characters)")
    return ;
}
try {
    const res = await axios.post(`${serverUrl}/api/v1/register`, userState);
    console.log("User registered successfully", res.data);
    toast.success("User registered successfully");

    // clear the form
    setUserState({
      name: "",
      email: "",
      password: "",
    });

    // redirect to login page
    router.push("/login");
  } catch (error) {
    console.log("Error registering user", error);
    toast.error(error.response.data.message);
  }
};

//login the user
const loginUser=async(e)=>{
  e.preventDefault();
  try{


    const res=await axios.post(`${serverUrl}/api/v1/login`, {
      email:userState.email,
      password:userState.password,
    },
    {
      withCredentials:true,//send cookies

    }
  )
  toast.success("User logged in successfully");
  setUserState({
    email:"",
    password:"",

  })
 //push the user to the dashborad page / main page
 router.push("/")

  }
  catch(error){
   console.log("Error logging in user ",error);
   toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
  }
}
//get user logged in status

const userLoginStatus=async()=>{
  let loggedIn=false;

try{
  const res=await axios.get(`${serverUrl}/api/v1/login-status`,{
    withCredentials:true,
  })

  //coerce the string to boolean
  loggedIn=!!res.data
  // setLoading(false);

  if(!loggedIn){
    router.push("/login");
  }
}
catch(error){
console.log("Error getting the user login status",error)
setLoading(false);
// toast.error(error.response.data.message)
}console.log("User Logged in status ",loggedIn); 
return loggedIn;

}


//logout the user

const logoutUser=async()=>{
  try{
  const res=await axios.get(`${serverUrl}/api/v1/logout`,{
    withCredentials:true,
  })
  toast.success("User Logged out successfully");

  router.push("/login");}
  catch(error){
    console.log("Error logging out user",error);
    toast.error(error.response.data.message);
  }
}




//het user details
const getUser=async()=>{
  setLoading(true);
  try{
    const res=await axios.get(`${serverUrl}/api/v1/user`,{
      withCredentials:true,
    })
    // console.log("User details",res.data);
    setUser((prevState)=>({
      ...prevState,
      ...res.data,
    }));
    setLoading(false);

  }
  catch(error){
    console.log("Error getting user details",error);
    setLoading(false);
    toast.error(error.response.data.message);
  }
}


//dynamic form handler
const handlerUserInput = (name) => (e) => {
    const value = e.target.value;
  
    setUserState((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }
  
  useEffect(() => {
    const loginStatusGetUser = async () => {
      const isLoggedIn = await userLoginStatus();
      console.log("User logged in ", isLoggedIn);
      if (isLoggedIn) {
        await getUser();
      }
    }
    loginStatusGetUser();
}, []);



    return (
        <UserContext.Provider value={{
            registerUser,
            userState,
            handlerUserInput,
            loginUser,
            logoutUser,
            userLoginStatus,
            user

         } }>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext=()=>{
    return useContext(UserContext);
}



