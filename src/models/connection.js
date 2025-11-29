const mongoose=require('mongoose')
const connectionSchema=new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:{
          values:['ignore','interested','accepted','rejected'],
        message:`{VALUE} is not a valid status`
    }
}
},{timestamps:true})
connectionSchema.index({fromUserId:1,toUserId:1})
connectionSchema.pre('save',function(){
    const connection=this
    if(connection.fromUserId.equals(connection.toUserId)){
        throw new Error('Cannot send connection request to yourself')
    }
    next()
})
const Connection=new mongoose.model('Connection',connectionSchema)
module.exports=Connection