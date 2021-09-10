const mongoose = require('mongoose')

const { Schema } = mongoose;

  const NotesSchema = new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title: {
        type: String,
        required :true
    },
    description: {
        type: String,
        required :true,
        unique:true
    },
    tag: {
        type: String,
        required :true
    },
    date: {
        type: String,
        default:Date.now
    },

    
  });

  const Notes = mongoose.model('note',NotesSchema)
  module.exports= Notes