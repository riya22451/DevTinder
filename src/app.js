const express=require('express');
const app=express();
const connectDB=require('../config/db');
const User=require('./models/user');
const bcrypt=require('bcrypt');
const validator=require('validator');
const cookieParser=require('cookie-parser');
const jwt=require('jsonwebtoken');
const authUser=require('../middlewares/auth.middleware.js');
const authrouter=require('./routes/auth.js')
const profileRouter=require('./routes/profile.js')
const connectionRouter=require('./routes/connection.js')
app.use(cookieParser()); // Middleware to parse cookies
const {validateSignUpData}=require('./utils/validation');
connectDB().then((conn)=>{
    console.log(`MongoDB connected: ${conn.connection.host}`);
}).catch((err)=>{
    console.log(err);
})
app.use(express.json())
app.use('/api/auth',authrouter)
app.use('/api',profileRouter)
app.use('/api/connection',connectionRouter)
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})

