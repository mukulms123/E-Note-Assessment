const User = require("../models/User");
const {validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");

//controller for Signup
exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    });
  }
  const user = new User(req.body);
  user.save((err, user) => {
    if (err) {
      console.log(err);
      return res.status(400).json({error: "Can't create User"});
    } else {
      user.encry_password = undefined;
      user.salt = undefined;
      return res.status(200).json(user);
    }
  });
};

//controller for Signin
exports.signin = (req, res) => {
  console.log("Signin initialized");
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({error: error.array()[0].msg});
  }

  //if no error in input, then find user in db
  var {email, password} = req.body;
  User.findOne({email}, (err, user) => {
    //if there is some issue
    if (err || !user) {
      return res.status(400).json({error: "Can't find the user in Database"});
    }

    //if user's password is nto correct
    if (!user.authenticate(password)) {
      return res.status(400).json({error: "Email and Password doesn't match!"});
    }

    //If user is correct token will be stored in user's browser cookies
    const token = jwt.sign({_id: user._id}, process.env.SECRET);

    //put token in browser
    res.cookie("token", token, {expire: new Date() + 1035});

    const {_id, name, lastname, email} = user;
    return res.status(200).json({token, user: {_id, name, lastname, email}});
  });
};

//Signout the user by deleting the cookie from user browser
exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User Signed out successfuly",
  });
};

//Middleware to check if the user id verified or not
exports.isSignedIn = expressJwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  userProperty: "auth",
});

exports.isAuthenticated = (req, res, next) => {
  let checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(400).json({error: "User is not authenticted"});
  }
  next();
};
