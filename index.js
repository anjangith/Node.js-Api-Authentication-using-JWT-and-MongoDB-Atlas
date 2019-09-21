const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const postRoute = require('./routes/posts');
//Import routes

const authRoute = require('./routes/auth')
dotenv.config();
mongoose.connect(
  process.env.DB_CONNECT,{useNewUrlParser: true, useUnifiedTopology: true  },
() => console.log("Connected to db"));
//middleware
app.use(express.json());
//Route middleware
app.use('/api/user',authRoute);
app.use('/api/posts',postRoute);
app.listen(3000,()=>console.log("Server started!"));
