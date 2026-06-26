const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    institute: String,

    degree: String,

    field: String,

    startYear: Number,

    endYear: Number,

    cgpa: Number,


    university:String

  },

  {
    timestamps: true,
  }

);

const educationModel = mongoose.model("Education", educationSchema);

module.exports = educationModel