const cron=require('node-cron');
const {subDays, startOfDay, endOfDay}=require('date-fns');
const Connection=require('../models/connection.js');
const {sendEmail}=require('../utils/sendEmail.js');
cron.schedule('58 21 * * *', async () => {
   
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
      sendEmail(
  email,
  'New Connection Request',
  'You have a new connection request!'
)
  .then(() => console.log("✅ Email sent"))
  .catch(err => console.error("❌ Email failed:", err.message));

    }
 } catch (error) {
    
 }
});
