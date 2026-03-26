import mongoose, { mongo, Schema } from "mongoose";


const SessionSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserModel",
        required:true
    },
    refreshToken:{
        type:String,
        required:true
    },
  
    revoke:{
        type:Boolean,
        default:false
    },
    expiresAt: {
    type: Date,
        default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
         index: { expires: 0 }
    }

},{timestamps:true})

const SessionModel = mongoose.models.SessionModel ||  mongoose.model("SessionModel",SessionSchema)
export default SessionModel