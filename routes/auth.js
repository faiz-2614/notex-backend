const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

const router = express.Router();

//create a user using:Post "/api/auth"(Auth.js not required)
router.post('/',[
    body('email', 'Enter a valid Name').isEmail(),
    body('name').isLength({min:3}),
    body('password').isLength({min:8}),
] ,(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //console.log(req.body);
    User.create({
        name: req.body.name,
        password: req.body.password,
        email:req.body.email
      }).then(user => res.json(user))
      .catch(err => {console.log(err)
          res.json({error:'please enter unique value for email'})
      })

})

module.exports=router