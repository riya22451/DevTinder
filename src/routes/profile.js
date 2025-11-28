const express=require('express')
const profileRouter=express.Router();
const authUser=require('../../middlewares/auth.middleware.js')
const validateUpdate=require('../utils/validateUpdate.js')
const validator=require('validator')
const bcrypt=require('bcrypt')
profileRouter.get('/profile',authUser,async (req,res)=>{
    
   const user=req.user;
    res.send(user)
})
profileRouter.patch('/profile/edit',authUser,async (req,res)=>{
try {
    if(!validateUpdate(req.body)){
        throw new Error('Invalid updates!')
    }
    const user=req.user;
    const updates=Object.keys(req.body)
    updates.forEach((update)=>{
        user[update]=req.body[update]
    })
    await user.save();
    res.status(200).send({message:"User updated successfully"})
} catch (error) {
    return res.status(404).send(error.message);
}
})
profileRouter.patch('/profile/password',authUser,async (req,res)=>{
    try {
        const user=req.user;
        const password=req.body.password;
        if(!validator.isStrongPassword(password)){
            throw new Error('Password is not strong enough!')
        }
        const compare=await bcrypt.compare(password,user.password)
        if(compare){
            throw new Error('New password must be different from the old password')
        }
        const hash= await bcrypt.hash(password,10);
        user.password=hash;
        await user.save();
        res.status(200).send({message:'Password updated successfully'})
    } catch (error) {
        res.status(404).send(error.message);
    }
})
module.exports=profileRouter