const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    name: String,

    title: String,

    bio: String,

    about: String,

    profileImage: String,

    resume: String,

    email: String,

    phone: String,

    address: String,

    github: String,

    linkedin: String,

    portfolio: String,

    twitter: String,
  },
  { timestamps: true }
);

const profileModel = mongoose.model("Profile", profileSchema); 

module.exports = profileModel