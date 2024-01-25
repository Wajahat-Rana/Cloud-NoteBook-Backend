const express = require('express');
const router = express.Router();
const User = require('../modules/User');
//For Validating User Inputs
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');


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
      return res.status(400).json("Email already exists!")
    }
    else if (checkUserUserName) {
      return res.status(400).json("Username is not Available!")
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
      res.send('Signup Successfull!')
    console.log(req.body)
    }
  }
)

module.exports = router;