const express = require("express");
const {
  signup,
  signin,
  signout,
  isSignedIn,
  isAuthenticated,
} = require("../controller/Auth");
const router = express.Router();
const User = require("../models/User");
const {getUserById, getUser} = require("../controller/User");
const {check} = require("express-validator");

router.param("userId", getUserById);

router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

module.exports = router;
