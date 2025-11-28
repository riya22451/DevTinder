const express=require('express');
const bcrypt=require('bcrypt');
const User=require('../models/user.js')
const {validateSignUpData}=require('../utils/validation.js')
const authrouter=express.Router();
authrouter.post('/signup', async (req,res)=>{
   
    try{
        validateSignUpData(req);
 
 const hash=await bcrypt.hash(req.body.password,10)
 const {firstName,lastName,emailId}=req.body
 const user=new User({
    firstName,
    lastName,
    emailId,
    password:hash
 });
await user.save();
res.status(201).send({message:'User registered successfully'});
    }
    catch(error){
        console.log(error.message);
res.status(500).send({message:error.message});
    }
    
})
authrouter.post('/login',async (req,res)=>{
    try {
        const {emailId,password}=req.body
        if(!validator.isEmail(emailId)){
            throw new Error('Email is not valid!')
        }
        const user= await User.findOne({emailId});
        if(!user){
            throw new Error('Invalid credentials')
        }
        const hash=user.password
     const isPasswordValid=await bcrypt.compare(password,hash)
      if(!isPasswordValid){
        throw new Error('Incorrect password')
      }
      // Add the token to the cookies and respond back
const token=user.getJWT();

res.cookie('token',token,{httpOnly:true})
      return res.status(200).send({message:'Login successful'})
    } catch (error) {
        return res.status(500).send({message:error.message})
    }
})
module.exports=authrouter