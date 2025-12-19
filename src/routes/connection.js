const express=require('express')
const connectionRouter=express.Router();
const Connection=require('../models/connection.js')
const authUser=require('../../middlewares/auth.middleware.js')
const User=require('../models/user.js')
const {sendEmail}=require('../utils/sendEmail.js')
connectionRouter.post('/request/send/:status/:toUserId', authUser, async (req, res) => {
  try {
    const fromUserId = req.user._id;
    const toUserId = req.params.toUserId;
    const status = req.params.status;

    const validStatus = ['ignore', 'interested'];

    const user = await User.findById(toUserId);
    if (!user) throw new Error('User not found');

    if (!validStatus.includes(status)) throw new Error('Invalid status');

    // Check if YOU already sent a request
    const existingConnection = await Connection.findOne({
      fromUserId,
      toUserId
    });

    if (existingConnection) {
      throw new Error('Connection request already sent');
    }

    // Check if OTHER USER already sent YOU a request
    const reverseConnection = await Connection.findOne({
      fromUserId: toUserId,       // <-- FIXED
      toUserId: fromUserId        // <-- FIXED
    });

    if (reverseConnection) {
      throw new Error('User has already sent you a connection request');
    }

    const connection = new Connection({
      fromUserId,
      toUserId,
      status
    });

    await connection.save();
    await sendEmail(user.emailId)
    res.status(200).json({ message: 'Connection request sent successfully' });

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

connectionRouter.post('/request/review/:status/:requestId',authUser,async (req,res)=>{
    try {
        const requestId=req.params.requestId;
        const status=req.params.status;
        const loggedInUserId=req.user._id;
        const validValues=['accepted','rejected']
        if(!validValues.includes(status)){
            throw new Error('Invalid status');
        }

        const connection=await Connection.findOne({_id:requestId,toUserId:loggedInUserId,status:'interested'});
        
       
        if(!connection){
            throw new Error('Connection request not found');
        }
        
        connection.status=status;
        await connection.save();
        res.status(200).json({message:`Connection request ${status} successfully`})
    } catch (error) {
        res.status(400).json({message:error.message})
    }
})
module.exports=connectionRouter