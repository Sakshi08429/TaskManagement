import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
    name:{
       type:String,
       required:[true,"Please provide a name"],
    },
    email:{
        type:String,
        required:[true,"Please provide an email"],
        unique:true,
        trim:true,
        match:[/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,"Please provide a valid email"],
    },
    password:{
        type:String,
        required:[true,"Please provide a password"],
       
    },
    photo:{
        type:String,
        default:"no-phot.jpg",
    },
    bio:{
        type:String,
        default:"I am a new user",
    },
    role:{
        type:String,
        enum:["user","admin","creator"],
        default:"user",
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
},{timestamps:true ,minimize:true})

const User=moongoose.model("User",UserSchema);
export default User;