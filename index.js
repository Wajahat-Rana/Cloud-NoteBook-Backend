const express = require('express');
const connectDB = require('./connectDB');
const cors = require('cors')


//Creating express App
const app = express();
app.use(cors())
app.use(express.json());
connectDB();

//Linking Route /api/auth with auth route in auth.js file.
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/note'));


//Runnign App on Port 3000
app.listen(3000,()=>{
    console.log('Listening At Port 3000!')
});

