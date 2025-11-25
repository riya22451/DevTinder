const mongoose=require('mongoose')
const connectDB=async()=>{
    try{
        const conn=await mongoose.connect("mongodb+srv://riya:riya1005@cluster0.mfqgmag.mongodb.net/mydb")
       return conn;
    }
    catch(error){
        console.log(error.message);
    }
}

module.exports=connectDB
