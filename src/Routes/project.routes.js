const express = require("express");
const Project = require("../Model/project.model");
const authMiddleware = require("../middleware/auth.middleware");

const projectRouter = express.Router();

const projectCategories = new Set(["Frontend", "Backend", "Full Stack", "Mobile", "Other"]);

function normalizeProjectPayload(body = {}) {
  const category = typeof body.category === "string" ? body.category.trim() : body.category;
  const techStack = Array.isArray(body.techStack)
    ? body.techStack.map((tech) => String(tech).trim()).filter(Boolean)
    : [];

  return {
    title: typeof body.title === "string" ? body.title.trim() : body.title,
    description: typeof body.description === "string" ? body.description.trim() : body.description,
    techStack,
    githubLink: typeof body.githubLink === "string" ? body.githubLink.trim() : "",
    liveLink: typeof body.liveLink === "string" ? body.liveLink.trim() : "",
    category: projectCategories.has(category) ? category : "Full Stack",
    featured: Boolean(body.featured),
    displayOrder: Number.isFinite(Number(body.displayOrder)) ? Number(body.displayOrder) : 0,
  };
}

// Create Project
projectRouter.post("/", authMiddleware, async (req, res) => {
  try {
    const project = await Project.create(normalizeProjectPayload(req.body));

    res.status(201).json({
      message: "Project created successfully",
      project,
    });
  } catch (err) {
    console.error("Create project error:", err);
    const status = err.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
      message: status === 400 ? "Invalid project data" : "Internal Server Error",
      errors: status === 400 ? Object.values(err.errors).map((error) => error.message) : undefined,
    });
  }
});

// Get All Projects
projectRouter.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ displayOrder: 1 });

    res.status(200).json({
      projects,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get Single Project
projectRouter.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update Project
projectRouter.put("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      normalizeProjectPayload(req.body),
      {
        new: true,
        runValidators: true,
      }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project updated successfully",
      project,
    });
  } catch (err) {
    console.error("Update project error:", err);
    const status = err.name === "ValidationError" ? 400 : 500;
    res.status(status).json({
      message: status === 400 ? "Invalid project data" : "Internal Server Error",
      errors: status === 400 ? Object.values(err.errors).map((error) => error.message) : undefined,
    });
  }
});

// Delete Project
projectRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = projectRouter;
