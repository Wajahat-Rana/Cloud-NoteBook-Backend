const mongoose = require('mongoose');

const connectDB = ()=>{mongoose.connect('mongodb://127.0.0.1:27017/Cloud-Notebook')
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));
};

module.exports = connectDB;