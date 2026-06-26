const educationModel = require('../Model/education.model')
const express = require('express')
const educationRouter = express.Router()
const authMiddleware = require("../middleware/auth.middleware");
const { findByIdAndDelete } = require('../Model/admin.model');

//Create Education
educationRouter.post("/create", authMiddleware, async (req, res) => {
    try {
        const {
            institute,
            degree,
            field,
            startYear,
            endYear,
            cgpa,
            university,
        } = req.body;

        const education = await educationModel.create({
            institute,
            degree,
            field,
            startYear,
            endYear,
            cgpa,
            university,
        });

        res.status(201).json({
            success: true,
            education,
        });
    } catch (error) {
        console.error(error); // <-- Print the actual error
        res.status(500).json({
            error: error.message,
        });
    }
});


//Education D

educationRouter.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const {
      institute,
      degree,
      field,
      startYear,
      endYear,
      cgpa,
      university,
    } = req.body;

    const adminEducation = await educationModel.findById(id);

    if (!adminEducation) {
      return res.status(404).json({
        success: false,
        message: "Education not found",
      });
    }

    const updateEducation = await educationModel.findByIdAndUpdate(
      id,
      {
        institute,
        degree,
        field,
        startYear,
        endYear,
        cgpa,
        university,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Education updated successfully",
      education: updateEducation,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Update Education Error",
    });
  }
});

//Delete Education
educationRouter.delete("/delete/:id",authMiddleware,async(req,res)=>{
    try{
        const {id}=req.params

        const admin = await educationModel.findById(id)

        if(!admin){
            return res.status(404).json({message:"User not found"})
        }

        await educationModel.findByIdAndDelete(id)
        res.status(200).json({message:"Eduction delete successfuly"})


    }catch(err){
        console.log(err)
        console.log("Delete education error")
        res.status(500).json({error:"User Education delete error"})
    }
})


// Get All Education
educationRouter.get("/", async (req, res) => {
  try {
    const education = await educationModel.find();

    res.status(200).json({
      success: true,
      count: education.length,
      education,
    });

  } catch (err) {
    console.log(err);
    console.log("Get all Education error");

    res.status(500).json({
      success: false,
      message: "Get education error",
    });
  }
});
module.exports = educationRouter