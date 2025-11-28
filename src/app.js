const express=require('express');
const app=express();
const connectDB=require('../config/db');
const User=require('./models/user');
const bcrypt=require('bcrypt');
const validator=require('validator');
const cookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken');
const authUser=require('../middlewares/auth.middleware.js');
app.use(cookieParser()); // Middleware to parse cookies
const {validateSignUpData}=require('./utils/validation');
connectDB().then((conn)=>{
    console.log(`MongoDB connected: ${conn.connection.host}`);
}).catch((err)=>{
    console.log(err);
})
app.use(express.json())
app.post('/signup', async (req,res)=>{
   
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
app.get('/feed', async (req,res)=>{
    try{
 const email=req.body.email;
    const userFeed=await User.findOne({
        emailId:email
    })
 res.status(200).send(userFeed);
    }
    catch(error){
        console.log(error.message);
        res.status(500).send({message:'cant find email'})
    }
   
    
})
app.post('/login',async (req,res)=>{
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
app.delete('/user',async (req,res)=>{
    const id=req.body.userId
    try {
        const deletedUser=await User.findByIdAndDelete({_id:id});
        res.status(200).send({message:'User deleted successfully'});
    } catch (error) {
        res.status(500).send({message:'Error deleting user'});
    }
})
app.patch('/user/:id',async (req,res)=>{
    const id=req.params?.id
    const updates=req.body.updates
    const allowedUpdates=['age','gender'];
    const isValidOperation=Object.keys(updates).every((update)=>{
        return allowedUpdates.includes(update);
    })
    if(!isValidOperation){
        return res.status(400).send({message:'Invalid updates!'});
    }
    try {
        const updatedUser=await User.findByIdAndUpdate({_id:id},updates)
        res.status(200).send({message:'User updated successfully'});
    } catch (error) {
        res.status(500).send({message:'Error updating user'});
    }
})
app.get('/profile',authUser,async (req,res)=>{
    
   const user=req.user;
    res.send(user)
})
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})
