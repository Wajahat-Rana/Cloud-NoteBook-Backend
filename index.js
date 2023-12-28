const express = require('express');
const connectDB = require('./connectDB');

const app = express();
app.use(express.json());

app.use('/api/auth',require('./routes/auth'));


app.listen(3000,()=>{
    console.log('Listening At Port 3000!')
});

connectDB();