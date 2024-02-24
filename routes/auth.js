const express = require('express');
const router = express.Router();
const User = require('../modules/User');
//For Validating User Inputs
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = "Welcome$";
const fetchUser = require("../middleware/fetchUser");

//post request for signup new users.
router.post('/signup',
  //Adding Validations
  [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email').trim().isEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
  ],
  async (req, res) => {
    const error = await validationResult(req);
    //Checking whether there is any validation error
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() })
    }
    //Checking whether Entered Email or Username already exists
    const checkUserEmail = await User.findOne({ email: req.body.email })
    const checkUserUserName = await User.findOne({ username: req.body.username })

    if (checkUserEmail) {
      const success = false;
      return res.status(400).json({success,error:"Email already exists!"})
    }
    else if (checkUserUserName) {
      const success = false;
      return res.status(400).json({success,error:"Username is not Available!"})
    }
    //Creating new user in database
    else {
      const salt =await bcrypt.genSalt(8);
      const hashedPassword =await bcrypt.hash(req.body.password,salt);
      const user = await User(
        {
          username: req.body.username,
          email: req.body.email,
          password: hashedPassword
        })
      user.save();
      const payLoad = {
        user:{
          id: user._id
        }
      }
      const authToken = jwt.sign(payLoad,jwtSecret);
      const success = true;
      res.json({success,authToken})
    console.log(req.body)
    }
  }
)
//post request for login existing users.

router.post('/login',
  //Adding Validations
  [
    body('email').trim().isEmail().withMessage('Please Enter A Valid Email Address!'),
    body('password').exists().withMessage('Password Cannot Be Empty!')
  ],
  async (req, res) => {
    const error = await validationResult(req);
    //Checking whether there is any validation error
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() })
    }
    try {
    const user = await User.findOne({email: req.body.email});
    if(!user){
      const success = false;
     return res.status(400).json({success, error: "Please Enter Valid Credentials" })
    }
    const comparisonResult =await bcrypt.compare(req.body.password,user.password);
    if(!comparisonResult){
      const success = false;
       return res.status(400).json({ success,error: "Please Enter Valid Password." })
    }
    const payLoad = {
      user:{
        id: user._id
      }
    }
    const success = true
    const authToken = jwt.sign(payLoad,jwtSecret);
    res.json({success,authToken})
  }
     catch (error) {
      console.error(error)
      res.status(500).send("Internal Server Error")
    }
  }
)

//post request to get data of logged In user.
router.post('/getuser',fetchUser,async (req, res) => {
  try {
    const userId = req.user.id;
    const user =await User.findById(userId).select("-password");
    res.status(200).json(user);
    } catch (error) {
    console.error(error);
    res.status(401).send({error:"Please Enter A Valid Auth Token"})
  }
})

module.exports = router;