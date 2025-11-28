const validateUpdate=(data)=>{
    const allowedUpdates=['firstName','lastName','email','age','gender']
    const isValid=Object.keys(data).every((update)=>{
        return allowedUpdates.includes(update)
    })
    return isValid;
}
module.exports=validateUpdate