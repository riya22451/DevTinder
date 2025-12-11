const jwt=require('jsonwebtoken');
const User=require('../src/models/user.js');
const authUser=async (req,res,next)=>{
     console.log("authUser called:", req.method, req.path);
    if (req.method === "OPTIONS") {
    return next();
}
if (req.method === "PATCH") {
    console.log("authUser PATCH called");
}

    try {
        
        const cookie=req.cookies;
    const {token}=cookie;
    if(!token){
       return res.status(401).send('Authentication required')
    }
    const decodedMessage=await jwt.verify(token,'RIYA2206');
    const {_id}=decodedMessage
    const user=await User.findById({_id});
   if(!user){
    throw new Error('User not found')
   }
   req.user=user
   next();
    } catch (error) {
        res.status(404).send(error.message)
    }
    
}
module.exports=authUser;