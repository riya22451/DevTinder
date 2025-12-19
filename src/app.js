const express = require('express');
const app = express();

const connectDB = require('../config/db');

// Routers
const authrouter = require('./routes/auth.js');
const profileRouter = require('./routes/profile.js');
const connectionRouter = require('./routes/connection.js');
const userRouter = require('./routes/user.js');
const feedRouter = require('./routes/feed.js');

require('dotenv').config();
require('./utils/cronjob.js');
// Middleware
const cookieParser = require('cookie-parser');
const cors=require('cors');

// ------------------------------
// 1) CUSTOM CORS (MUST BE FIRST)
// ------------------------------
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.headers.origin);
  next();
});

app.use(cors({
  origin:[ "http://localhost:5173",          // local frontend
      "http://localhost:3000",          // local backend testing
      "https://dev-tinder-ui-one.vercel.app"], // deployed frontend,
  credentials: true,
 
}));



// ------------------------------
// 2) DEFAULT MIDDLEWARES
// ------------------------------

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ------------------------------
// 3) CONNECT DATABASE
// ------------------------------

connectDB()
  .then((conn) => {
    console.log(`MongoDB connected: ${conn.connection.host}`);
  })
  .catch((err) => {
    console.log(err);
  });


// ------------------------------
// 4) ROUTES
// ------------------------------

app.use('/api/auth', authrouter);
app.use('/api/profile', profileRouter);
app.use('/api/connection', connectionRouter);
app.use('/api/user', userRouter);
app.use('/api/feed', feedRouter);


// ------------------------------
// 5) START SERVER
// ------------------------------

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
