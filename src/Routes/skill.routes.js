const express = require("express");
const skillModel = require("../Model/skill.model");
const authMiddleware = require("../middleware/auth.middleware");

const skillRouter = express.Router();

/*
=========================
Create Skill
POST /admin/skills/create
=========================
*/

skillRouter.post("/create", authMiddleware, async (req, res) => {
  try {
    const {
      name,
      category,
      level,
      description,
      featured,
      displayOrder,
    } = req.body;

    const existingSkill = await skillModel.findOne({ name });

    if (existingSkill) {
      return res.status(400).json({
        success: false,
        message: "Skill already exists",
      });
    }

    const skill = await skillModel.create({
      name,
      category,
      level,
      description,
      featured,
      displayOrder,
    });

    res.status(201).json({
      success: true,
      message: "Skill created successfully",
      skill,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Create skill error",
    });
  }
});


/*
=========================
Get All Skills
GET /admin/skills
=========================
*/

skillRouter.get("/", async (req, res) => {
  try {
    const skills = await skillModel.find().sort({ displayOrder: 1 });

    res.status(200).json({
      success: true,
      totalSkills: skills.length,
      skills,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Fetch skills error",
    });
  }
});


/*
=========================
Get Single Skill
GET /admin/skills/:id
=========================
*/

skillRouter.get("/:id", async (req, res) => {
  try {
    const skill = await skillModel.findById(req.params.id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    res.status(200).json({
      success: true,
      skill,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Fetch skill error",
    });
  }
});


/*
=========================
Update Skill
PUT /admin/skills/update/:id
=========================
*/

skillRouter.put("/update/:id", authMiddleware, async (req, res) => {
  try {

    const { id } = req.params;

    const skill = await skillModel.findById(id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    const updatedSkill = await skillModel.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      skill: updatedSkill,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Update skill error",
    });
  }
});


/*
=========================
Delete Skill
DELETE /admin/skills/delete/:id
=========================
*/

skillRouter.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {

    const { id } = req.params;

    const skill = await skillModel.findById(id);

    if (!skill) {
      return res.status(404).json({
        success: false,
        message: "Skill not found",
      });
    }

    await skillModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: "Delete skill error",
    });
  }
});

module.exports = skillRouter;