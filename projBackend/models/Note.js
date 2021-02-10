const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    content: {
      type: String,
      trim: false,
    },
    filename: {
      type: String,
    },
    create_At: {
      type: Date,
      default: new Date(),
    },
    owner: {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: String,
    },
  },
  {timestamps: true}
);

module.exports = mongoose.model("Note", noteSchema);
