const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    profilePic: {
      type: String,
      default:
        "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Clipart.png",
    },
    public_id: {
      type: String,
    },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    threads: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
    reposts: [{ type: mongoose.Schema.Types.ObjectId, ref: "post" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
