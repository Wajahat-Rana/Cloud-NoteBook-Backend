const express = require('express');
const connectDB = require('./connectDB');

//Creating express App
const app = express();
app.use(express.json());
connectDB();

//Linking Route /api/auth with auth route in auth.js file.
app.use('/api/auth',require('./routes/auth'));

//Runnign App on Port 3000
app.listen(3000,()=>{
    console.log('Listening At Port 3000!')
});

