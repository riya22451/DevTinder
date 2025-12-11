const mongoose = require('mongoose');
const validator=require('validator')
const jwt=require('jsonwebtoken')
const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    
        password:{
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
    photoUrl:{
        type:String
    },
    gender:{
        type:String
    },
    about:{
        type:String
    }
},{timestamps:true})
userSchema.methods.getJWT=function(){
    const user=this
    const token = jwt.sign({_id:user._id},'RIYA2206',{expiresIn:'1h'})
    return token;
}
const User=mongoose.model('User',userSchema);
module.exports=User