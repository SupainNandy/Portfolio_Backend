const express = require("express");
const Resume = require("../Model/resume.model");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/auth.middleware");
const { uploadFile } = require("../config/imagekit");

const resumeRouter = express.Router();

// Create Resume & CV
resumeRouter.post(
  "/",
  authMiddleware,
  upload.fields([
    { name: "resumePdf", maxCount: 1 },
    { name: "cvPdf", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { title } = req.body;

      if (!req.files?.resumePdf || !req.files?.cvPdf) {
        return res.status(400).json({
          message: "Both Resume and CV PDFs are required",
        });
      }

      const existing = await Resume.findOne();

      if (existing) {
        return res.status(400).json({
          message: "Documents already exist",
        });
      }

      const resumeUrl = await uploadFile(req.files.resumePdf[0]);
      const cvUrl = await uploadFile(req.files.cvPdf[0]);

      const docs = await Resume.create({
        title,
        resumePdf: resumeUrl,
        cvPdf: cvUrl,
      });

      res.status(201).json({
        message: "Documents uploaded successfully",
        docs,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);

// Get Documents
resumeRouter.get("/", async (req, res) => {
  try {
    const docs = await Resume.findOne();
    res.status(200).json(docs);
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

// Update Documents
resumeRouter.put(
  "/:id",
  authMiddleware,
  upload.fields([
    { name: "resumePdf", maxCount: 1 },
    { name: "cvPdf", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const updateData = {
        title: req.body.title,
      };

      if (req.files?.resumePdf) {
        updateData.resumePdf = await uploadFile(req.files.resumePdf[0]);
      }

      if (req.files?.cvPdf) {
        updateData.cvPdf = await uploadFile(req.files.cvPdf[0]);
      }

      const docs = await Resume.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!docs) {
        return res.status(404).json({
          message: "Documents not found",
        });
      }

      res.status(200).json({
        message: "Documents updated successfully",
        docs,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Internal Server Error",
      });
    }
  }
);

// Delete Documents
resumeRouter.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const docs = await Resume.findByIdAndDelete(req.params.id);

    if (!docs) {
      return res.status(404).json({
        message: "Documents not found",
      });
    }

    res.status(200).json({
      message: "Documents deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = resumeRouter;