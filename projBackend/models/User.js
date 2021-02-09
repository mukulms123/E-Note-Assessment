const mongoose = require("mongoose");
const crypto = require("crypto");
const {v1: uuidv1} = require("uuid");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    lastname: {
      type: String,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
    notes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
  },
  {timestamps: true}
);

userSchema
  .virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function () {
    return this._password;
  });

userSchema.methods = {
  //create a encrypted password using CRYPTO module
  securePassword: function (plainPassword) {
    if (!plainPassword || plainPassword === "") {
      return "";
    }
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainPassword)
        .digest("hex");
    } catch {
      return "";
    }
  },
  authenticate: function (plainPassword) {
    return this.securePassword(plainPassword) === this.encry_password;
  },
};

module.exports = mongoose.model("User", userSchema);
