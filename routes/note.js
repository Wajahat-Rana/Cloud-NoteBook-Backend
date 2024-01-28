const express = require('express');
const fetchuser = require('../middleware/fetchUser');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const Notes = require('../modules/Notes');

//Route 1 Add Note 
router.post('/addnote',fetchuser,[
    body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters long'),
    body('description').isLength({ min: 3 }).withMessage('Desription must be at least 5 characters long.')
],async (req,res)=>{
    const error = await validationResult(req);
    //Checking whether there is any validation error
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() })
    }
    try {
        const {title,description,tag} = req.body;
    const newNote = new Notes({
        title,description,tag,user:req.user.id
    })
    const addednote = await newNote.save();
    res.send(addednote)
    } catch (error) {
        console.error(error)
        res.status(500).send("Internal Server Error")
      }
    ;
})
//Route 2 Get All Notes
router.get('/getnotes',fetchuser,async (req,res)=>{
    const notes =await Notes.find({user: req.user.id})
    res.json(notes);
})


module.exports = router