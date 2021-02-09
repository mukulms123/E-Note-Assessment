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

router.post(
  "/signup",
  [
    check("name", "Name should be of atleast 3 characters.").isLength({min: 3}),
    check("password", "Password should be atleast 4 characters.").isLength({
      min: 4,
    }),
    check("email", "Email is required").isEmail(),
  ],
  signup
);

router.post(
  "/signin",
  [
    check("password", "Password should be atleast 4 characters.").isLength({
      min: 4,
    }),
    check("email", "Email is required").isEmail(),
  ],
  signin
);

router.get("/signout", signout);

module.exports = router;
