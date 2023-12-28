const express = require('express');
const router = express.Router();
const User = require('../modules/User');
//For Validating User Inputs
const { body, validationResult } = require('express-validator');

//post request for signup new users.
router.post('/signup',
//Adding Validations
[
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email').trim().isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  ],
  async(req,res)=>{
    const error = await validationResult(req);
    //Checking whether there is any validation error
    if(!error.isEmpty()){
        return res.status(400).json({errors : error.array()})
    }
    console.log(req.body)
    //Checking whether Entered Email or Username already exists
    const checkUserEmail = await User.findOne({email : req.body.email})
    const checkUserUserName = await User.findOne({username : req.body.username})

    if(checkUserEmail){
      return res.status(400).json("Email already exists!")
    }
    else if(checkUserUserName){
      return res.status(400).json("Username is not Available!")
    }
    //Creating new user in database
    else{
    const user =await User(req.body)
    user.save();
    res.send('Signup Successfull!')
    }
  }
)

module.exports = router;