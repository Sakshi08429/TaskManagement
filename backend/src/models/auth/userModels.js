import mongoose from "mongoose";
import bcrypt from "bcryptjs";
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

//hash the password before saving

UserSchema.pre("save",async function (next){
    if(!this.isModified("password")){
    return next();
    }
    //hash the password=>bcrypt
    const salt=await bcrypt.genSalt(10);
    //hash the password
  const hashedPassword=await bcrypt.hash(this.password,salt);

  //set the password to hashed password
   this.password=hashedPassword;

   //call the next middleware
   next();

})


const User=mongoose.model("User",UserSchema);
export default User;