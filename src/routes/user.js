const express=require('express')
const userRouter=express.Router();
const User=require('../models/user.js')
const authUser=require('../../middlewares/auth.middleware.js')
const Connection=require('../models/connection.js')
userRouter.get('/connections', authUser, async (req, res) => {
  try {
    const connections = await Connection.find({
      status: 'accepted',
      $or: [
        { fromUserId: req.user._id },
        { toUserId: req.user._id }
      ]
    }).populate('toUserId',['firstName','lastName']).populate('fromUserId',['firstName','lastName']);

     const data=await connections.map((connection)=>{
        if(connection.fromUserId._id.equals(req.user._id)){
            return connection.toUserId
        }
        else{
            return connection.fromUserId
        }
     })
    res.status(200).json({ connections });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
userRouter.get('/requests',authUser,async (req,res)=>{
 try {
    const userId=req.user._id;
    const requests=await Connection.find({toUserId:userId,status:'interested'}).populate('fromUserId',['firstName','lastName']);
    res.status(200).json({requests});
 } catch (error) {
    res.status(500).json({message:error.message});
 }
})

module.exports=userRouter