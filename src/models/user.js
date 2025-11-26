const mongoose = require('mongoose');
const validator=require('validator')
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid email format')
            }
        }
    },
    age:{
        type:Number
    },
    gender:{
        type:String
    }
},{timestamps:true})
const User=mongoose.model('User',userSchema);
module.exports=User