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

// Routes
// app.use("/api/projects", projectRouter);
// app.use("/api/admin", adminRouter);

module.exports = app;