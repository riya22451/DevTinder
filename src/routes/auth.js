const express=require('express');
const bcrypt=require('bcrypt');
const User=require('../models/user.js')
const {validateSignUpData}=require('../utils/validation.js')
const validator=require('validator')
const authrouter=express.Router();
const sendEmail=require('../utils/sendEmail.js')
authrouter.post('/signup', async (req,res)=>{
   
    try{
        validateSignUpData(req);
 
 const hash=await bcrypt.hash(req.body.password,10)
 const {firstName,lastName,emailId,age,gender,photoUrl,about}=req.body
 const user=new User({
    firstName,
    lastName,
    emailId,
    password:hash,
    age,
    gender,
    photoUrl,
    about
 });
await user.save();
await sendEmail(
      user.emailId,
      "Welcome to DevTinder 🎉",
      `
      <h2>Hello ${user.firstName},</h2>
      <p>Welcome to DevTinder! Your account has been created successfully.</p>
      <p>We're excited to have you on board.</p>
      <br/>
      <strong>DevTinder Team</strong>
      `
    );

const token=user.getJWT();

res.cookie('token',token,{
    httpOnly: true,
    secure: true,
  sameSite: "none",
})
    


      return res.status(200).send({user})
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

res.cookie('token',token,{
    secure: true,
  sameSite: "none",
})
    


      return res.status(200).send({user})
    } catch (error) {
        return res.status(500).send({message:error.message})
    }
})
authrouter.post('/logout',(req,res)=>{
    res.clearCookie('token')
    res.status(200).send({message:'LogOut Successful'})
})
module.exports=authrouter