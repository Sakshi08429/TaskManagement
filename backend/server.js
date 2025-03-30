
import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connect from "./src/db/connect.js"
import cookieParser from "cookie-parser"

import fs from  "node:fs"
import { error } from "node:console"

dotenv.config()
const port=process.env.PORT||5000;


const app=express();

//middleware
app.use(cors(
    {
        origin:process.env.CLIENT_URL,
        credentials:true
    }
))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


// routes
const routesFiles=fs.readdirSync("./src/routes");
// console.log(routesFiles);

routesFiles.forEach((file)=>{
    //use dynamic import
    import(`./src/routes/${file}`).then((route)=>{
        app.use("/api/v1",route.default);})
        .catch((error)=>{
   console.log("Error loading route file",error.message);
        })
})




const server=async()=>{
 try{
    await connect();
app.listen(port,()=>{
    console.log(`SERVER RUNNING ON PORT ${port}`);
})
 }

catch(error){
console.log("Failed to route files.....",error.message);
process.exit(1);    

}

}


server();