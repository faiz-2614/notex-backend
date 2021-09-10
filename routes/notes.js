const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const router = express.Router();
const { body, validationResult } = require("express-validator");

//Fetch All Notes
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  const notes = await Notes.find({ user:req.user.id});
  res.json(notes);
});

//Add a new Note
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter Valid Title").isLength({ min: 3 }),
    body("description","Enter Valid description").isLength({ min: 5 }),
  ],
  async (req, res) => {

    try {
        const { title, description, tag } = req.body;
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const note = new Notes({
      title,
      description,
      tag,
      user: req.user.id,
    });
    const savedNote = await note.save()
    res.json(savedNote);
    } catch (error) {
        res.status(500).send("Internal Error");
    }
    
  }
);

module.exports = router;
