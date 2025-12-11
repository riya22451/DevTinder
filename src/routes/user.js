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
    })
      .populate('toUserId', ['firstName', 'lastName','about','photoUrl'])
      .populate('fromUserId', ['firstName', 'lastName','about','photoUrl']);

    // Return only the connected users
    const connectedUsers = connections.map((connection) => {
      // If I am the sender, return receiver
      if (connection.fromUserId._id.equals(req.user._id)) {
        return connection.toUserId;
      }
      // Else return sender
      return connection.fromUserId;
    });

    res.status(200).json({ connections: connectedUsers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

userRouter.get('/requests',authUser,async (req,res)=>{
 try {
    const userId=req.user._id;
    const requests=await Connection.find({toUserId:userId,status:'interested'}).populate('fromUserId',['firstName','lastName','about','photoUrl']);
    res.status(200).json({requests});
 } catch (error) {
    res.status(500).json({message:error.message});
 }
})

module.exports=userRouter