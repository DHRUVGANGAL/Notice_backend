// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const { adminRouter } = require('./Route/admin');
// const { userRouter } = require('./Route/user');
// require('dotenv').config();


// const app = express();


// app.use(cors());
// app.use(express.json());
// app.use(bodyParser.urlencoded({ extended: true }));


// app.use('/admin', adminRouter);
// app.use('/user', userRouter);


// let isConnected = false;

// const connectToDatabase = async () => {
//   if (isConnected) {
//     console.log('Using existing database connection');
//     return;
//   }

//   try {
//     const db = await mongoose.connect(process.env.MONGOOSE_URL, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
    
//     isConnected = true;
//     console.log('Database connected successfully');
//     return db;
//   } catch (error) {
//     console.error('Database connection error:', error);
//     throw error;
//   }
// };


// connectToDatabase();


// module.exports = app;




// api/index.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { adminRouter } = require('./Route/admin');
const { userRouter } = require('./Route/user');
require('dotenv').config();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/admin', adminRouter);
app.use('/user', userRouter);
app.get('/',(req,res)=>{
    res.send("heloo")
})


// Database connection
let isConnected = false;
const connectToDatabase = async () => {
  if (isConnected) {
    console.log('Using existing database connection');
    return;
  }
  try {
    const db = await mongoose.connect(process.env.MONGOOSE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('Database connected successfully');
    return db;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

// For Vercel, export the API handler
module.exports = async (req, res) => {
  // Connect to the database before processing the request
  await connectToDatabase();
  
  // Let Express handle the request
  return app(req, res);
};