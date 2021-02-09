const express = require("express");
const {isSignedIn, isAuthenticated} = require("../controller/Auth");
const router = express.Router();
const {getUserById} = require("../controller/User");
const {
  createNote,
  isOwner,
  getNote,
  getNoteById,
  updateNote,
  getFile,
  deleteNote,
} = require("../controller/Note");

//multer implementation for File uploading
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const {originalname} = file;
    var date = new Date();
    const filename = `${req.profile.email}_${date.getTime()}_${originalname}`;
    cb(null, filename);

    //Using this variable in case new file was uploaded.
    if (req.note) {
      req.body.oldname = req.note.filename ? req.note.filename : undefined;
    }
    req.body.filename = filename;
  },
});
var upload = multer({storage});

router.param("userId", getUserById);
router.param("noteId", getNoteById);

//Create note
router.post(
  "/note/create/:userId",
  isSignedIn,
  isAuthenticated,
  upload.single("file"),
  createNote
);

//Route to get a Note
router.get(
  "/note/:noteId/:userId",
  isSignedIn,
  isAuthenticated,
  isOwner,
  getNote
);

//Download file route for user
router.get(
  "/note/:noteId/file/:userId",
  isSignedIn,
  isAuthenticated,
  isOwner,
  getFile
);

//Put request to update notes
router.put(
  "/note/:noteId/:userId",
  isSignedIn,
  isAuthenticated,
  isOwner,
  upload.single("file"),
  updateNote
);

//Delete a Note
router.delete(
  "/note/:noteId/:userId",
  isSignedIn,
  isAuthenticated,
  isOwner,
  deleteNote
);

module.exports = router;
