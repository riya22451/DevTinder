const express=require('express')
const connectionRouter=express.Router();
const Connection=require('../models/connection.js')
const authUser=require('../../middlewares/auth.middleware.js')
const User=require('../models/user.js')
connectionRouter.post('/request/send/:status/:toUserId',authUser,async (req,res)=>{
    try {
        const fromUserId=req.user._id;
        const toUserId=req.params.toUserId;
        const status=req.params.status;
        const validStatus=['ignore','interested']
        const user=await User.findById(toUserId);
        if(!user){
            throw new Error('user not found')
        }
        if(!validStatus.includes(status)){
            throw new Error('Invalid status')
        }
        const existingConnection=await Connection.findOne({fromUserId,toUserId});
      

        if(existingConnection){
            throw new Error('Connection request already sent')
        }
        const reverseConnection=await Connection.findOne({fromuserId:toUserId,toUserId:fromUserId})
        if(reverseConnection){
            throw new Error('User has already sent you a connection request')
        }
        const connection=new Connection({
            fromUserId,
            toUserId,
            status
        })
        await connection.save();
        res.status(200).json({message:'Connection request sent successfully'})
    } catch (error) {
        res.status(404).json({
            messsage:error.message})
    }
})
module.exports=connectionRouter