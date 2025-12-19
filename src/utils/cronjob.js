const cron=require('node-cron');
const {subDays, startOfDay, endOfDay}=require('date-fns');
const Connection=require('../models/connection.js');
const {sendEmail}=require('../utils/sendEmail.js');
cron.schedule('0 8 * * *', async () => {
   
 try {
     const yesterday=subDays(new Date(),0);
    const yesterdayStart=startOfDay(yesterday);
    const yesterdayEnd=endOfDay(yesterday);
    const pendingRequest= await Connection.find({
        status:'interested',
        createdAt:{ $gte: yesterdayStart,
            $lte: yesterdayEnd
        }
    }).populate('fromUserId toUserId');
    const emailId=new Set(pendingRequest.map(req=>req.toUserId.emailId));
    console.log(emailId);
    for(const email of emailId){
        try{
const res=await sendEmail(email, 'Pending Connection Requests', 'You have pending connection requests to respond to!')
console.log(res);
}
catch(err){
console.error("❌ Email sending failed:", err.message);
}
    }
 } catch (error) {
    
 }
});
