const express=require('express')
const profileRouter=express.Router();
const authUser=require('../../middlewares/auth.middleware.js')
profileRouter.get('/profile',authUser,async (req,res)=>{
    
   const user=req.user;
    res.send(user)
})

module.exports=profileRouter