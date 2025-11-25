const express=require('express');
const app=express();
const connectDB=require('../config/db');
const User=require('./models/user');
connectDB().then((conn)=>{
    console.log(`MongoDB connected: ${conn.connection.host}`);
}).catch((err)=>{
    console.log(err);
})
app.use(express.json())
app.post('/signup', async (req,res)=>{
    const user=new User(req.body);
    try{
await user.save();
res.status(201).send({message:'User registered successfully'});
    }
    catch(error){
        console.log(error.message);
res.status(500).send({message:'Server error'});
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
app.delete('/user',async (req,res)=>{
    const id=req.body.userId
    try {
        const deletedUser=await User.findByIdAndDelete({_id:id});
        res.status(200).send({message:'User deleted successfully'});
    } catch (error) {
        res.status(500).send({message:'Error deleting user'});
    }
})
app.patch('/user',async (req,res)=>{
    const id=req.body.userId
    const updates=req.body.updates
    try {
        const updatedUser=await User.findByIdAndUpdate({_id:id},updates)
        res.status(200).send({message:'User updated successfully'});
    } catch (error) {
        res.status(500).send({message:'Error updating user'});
    }
})

app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})
