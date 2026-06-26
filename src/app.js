const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://supain-portfolio.vercel.app"
  ],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello from server");
});

// Admin Auth
const adminRoutes = require("./Routes/admin.routes");
app.use("/admin/auth", adminRoutes);

// Admin Profile
const profileRoutes = require("./Routes/profile.routes");
app.use("/admin/profile", profileRoutes);

// Education
const educationRoutes = require("./Routes/education.routes");
app.use("/admin/education", educationRoutes);

// Skills
const skillRoutes = require("./Routes/skill.routes");
app.use("/admin/skill", skillRoutes);

// Projects
const projectRoutes = require("./Routes/project.routes");
app.use("/admin/project", projectRoutes);

// Resume
const resumeRoutes = require("./Routes/resume.routes");
app.use("/admin/resume", resumeRoutes);

module.exports = app;