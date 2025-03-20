import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        min:3
    }
},{timestamps:true})

const UserModel = mongoose.model('User',UserSchema)

export default UserModel