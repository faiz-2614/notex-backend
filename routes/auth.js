const express = require("express");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bycrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchUser =  require('../middleware/fetchUser')

const router = express.Router();

const JWT_SECRET = "notex";

//create a user using:Post "/api/auth"(Auth.js not required) No Login Required
router.post(
  "/createuser",
  [
    body("email", "Enter a valid Name").isEmail(),
    body("name").isLength({ min: 3 }),
    body("password").isLength({ min: 8 }),
  ],
  async (req, res) => {
    //if error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //check if user with email exist
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "User With Email Already Exists" });
      }

      const salt = await bycrypt.genSalt(10);
      const secPass = await bycrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      //.then(user => res.json(user))
      //    .catch(err => {console.log(err)
      //      res.json({error:'please enter unique value for email'})
      //})

      const data = {
        user: {
          id: user.id,
        },
      };
      const auth_token = jwt.sign(data, JWT_SECRET);
      res.json({ auth_token });
    } catch (error) {
      console.error(error.message);
     
    }
  }
);

//Authenticate a user using POST at "/api/auth/login". No Login Required
router.post(
  "/login",
  [
    body("email", "Enter a valid Name").isEmail(),
    body("password", "Cannot be Blank").exists(),
  ],
  async (req, res) => {
    //if error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "Try Login with Correct Credentials" });
      }

      const passCompare = await bycrypt.compare(password, user.password);
      if (!passCompare) {
        return res
          .status(400)
          .json({ error: "Try Login with Correct Credentials" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const auth_token = jwt.sign(data, JWT_SECRET);
      res.json({ auth_token });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal error");
    }
  }
);

//Get User Deatils POST "/api/auth/getuser" Login Required
router.post("/getuser", fetchUser,
  async (req, res) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password");
      res.send(user)
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal error");
    }
  }
);

module.exports = router;
