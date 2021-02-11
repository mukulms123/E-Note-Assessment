const Note = require("../models/Note");
const User = require("../models/User");
const fs = require("fs");

//get Notes by id, used in router params
exports.getNoteById = (req, res, next, id) => {
  Note.findOne({_id: id}, (err, note) => {
    if (err || !note) {
      return res.status(400).json({error: "Can't fetch Note from database"});
    }
    note.content = undefined;
    req.note = note;
    next();
  });
};

//verify whether the user is original owner or not
exports.isOwner = (req, res, next) => {
  let checker = req.profile && req.note && req.auth._id == req.note.owner.id;
  if (!checker) {
    return res
      .status(400)
      .json({error: "You are not authorized to access the data"});
  }
  next();
};

//Retrieves a single note
exports.getNote = (req, res) => {
  Note.findOne({_id: req.note._id}, (err, note) => {
    if (err || !note) {
      return res.status(400).json({error: "Can't fetch Note from database"});
    }
    return res.status(200).json(note);
  });
};

//retrieve a file
exports.getFile = (req, res) => {
  res.download(`./uploads/${req.note.filename}`, (err) => {
    if (err) {
      return res
        .status(400)
        .json({error: "Something went wrong while downloading file"});
    }
  });
};

//Create a note
exports.createNote = (req, res) => {
  const {title, content, filename} = req.body;
  if (!title || title.length < 3) {
    return res
      .status(400)
      .json({error: "Title must be longer than 3 characters"});
  }
  var note = new Note(req.body);
  note.owner.id = req.profile._id;
  note.owner.name = req.profile.name;
  note.save((err, note) => {
    if (err) {
      return res.status(400).json({error: "Wasn't able to save Note in DB."});
    }

    User.findById(req.profile._id, (err, user) => {
      user.notes.push(note._id);
      user.save();
    });
    return res.status(200).json(note);
  });
};

//Updates the note
exports.updateNote = (req, res) => {
  const {title, content, filename} = req.body;
  if (!title || title.length < 3) {
    return res
      .status(400)
      .json({error: "Title must be longer than 3 characters"});
  }
  if (req.body.oldname !== undefined) {
    var path = "./uploads/" + req.body.oldname;
    fs.unlinkSync(path);
  }
  var note = req.note;
  note.title = title;
  note.content = content;
  if (req.body.filename !== undefined) {
    note.filename = filename;
  }
  note.save((err, note) => {
    if (err || !note) {
      return res
        .status(400)
        .json({error: "Wasn't able to save updated note in DB."});
    }
    return res.status(200).json(note);
  });
};

exports.deleteNote = (req, res) => {
  var note = req.note;
  note.remove((err, deletedNote) => {
    if (err) {
      return res.status(400).json({error: "Couldn't delete the note!"});
    }
    var path = "./uploads/" + deletedNote.filename;
    fs.unlinkSync(path);
    User.findById({_id: req.profile._id}, (err, user) => {
      if (err || !user) {
        return res
          .status(400)
          .json({error: "Couldn't delete note's data from user!"});
      }
      var arr = user.notes;
      user.notes = arr.filter((note) => {
        return note != deletedNote._id;
      });
      user.save((err, user) => {
        if (err || !user) {
          return res
            .status(400)
            .json({error: "There was some error while updating user"});
        }
        return res.status(200).json({msg: "Success"});
      });
    });
  });
};
