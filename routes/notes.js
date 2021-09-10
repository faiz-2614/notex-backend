const express = require("express");
const fetchUser = require("../middleware/fetchUser");
const Notes = require("../models/Notes");
const router = express.Router();
const { body, validationResult } = require("express-validator");

//Fetch All Notes GET Login Required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  const notes = await Notes.find({ user:req.user.id});
  res.json(notes);
});

//Add a new Note POST Login Required
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

//Update a Note PUT Login Required
router.put(
  "/updatenote/:id",
  fetchUser,
  async (req, res) => {
    const {title,description,tag} = req.body;
    //Create new Note
    const newNote = {};
    if (title){newNote.title=title}
    if (description){newNote.description=description}
    if (tag){newNote.tag=tag}

    //find the note and update

    let note = await Notes.findById(req.params.id)
    if(!note){
      return req.status(404).send("Not Found")
    }

    if(note.user.toString()!==req.user.id){
      return req.status(401).send("Unauthorised Access")
    }

    note = await Notes.findByIdAndUpdate(req.params.id,{$set:newNote}, {new:true})
    res.json({note})
}
);


//Delete a note 
router.delete(
  "/deletenote/:id",
  fetchUser,
  async (req, res) => {
    
    //find the note and delete
    let note = await Notes.findById(req.params.id)
    if(!note){
      return req.status(404).send("Not Found")
    }
//delete only if use is same
    if(note.user.toString()!==req.user.id){
      return req.status(401).send("Unauthorised Access")
    }

    note = await Notes.findByIdAndDelete(req.params.id)
    res.json("Deleted")
}
);



module.exports = router;
