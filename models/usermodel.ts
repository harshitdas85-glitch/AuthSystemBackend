import { Schema } from "mongoose";
import mongoose from "mongoose";
import { unique } from "next/dist/build/utils";



const UserSchema = new Schema({
    
    username:{
           type:String,
           required:true,
           unique:true
    },
     email:{
           type:String,
           required:true,
           unique:true
    },
     password:{
           type:String,
           required:true,
                 
    },
    role:{
         type:String,
         enum:["owner","user"],
         default:"user"
    },
  
},{timestamps:true})


export const UserModel = mongoose.models.UserModel || mongoose.model('UserModel',UserSchema)
