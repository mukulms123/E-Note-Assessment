const User = require("../models/User");
const {validationResult} = require("express-validator");

//Middleware to find the user in the database
exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({error: "Can't find user in Database"});
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  var user = User.findById({_id: req.profile._id})
    .populate("notes")
    .exec((err, user) => {
      if (err) {
        return res.status(400).json({error: "Can't find the user!"});
      }
      user.salt = undefined;
      user.encry_password = undefined;
      return res.json(user);
    });
};
