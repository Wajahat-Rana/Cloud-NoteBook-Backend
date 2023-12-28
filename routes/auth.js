const express = require('express');
const router = express.Router();
const User = require('../modules/User');
const { body, validationResult } = require('express-validator');


router.post('/',[
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email').trim().isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  ],(req,res)=>{
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({errors : error.array()})
    }
    console.log(req.body)
    const user = User(req.body)
    user.save().then(()=>res.send(user))
    .catch(err=> {console.log(err) 
    res.json('Please Enter Unique Username And Email.')
  })
  }
)

module.exports = router;