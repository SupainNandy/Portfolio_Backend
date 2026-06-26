    const express = require('express')
    const cors = require('cors')
    const cookieParser = require('cookie-parser')

    const app = express()
   const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://supain-portfolio.vercel.app"
  ],
  credentials: true
}));
    app.use(express.json())
    app.use(express.urlencoded({extended:true}))
    app.use(cookieParser())

    app.get("/",(req,res)=>{
        res.send("Hello from server")
    })
    //Adin Auth
    const adminRoutes = require('../src/Routes/admin.routes')
    app.use('/admin/auth',adminRoutes)

    //Admin Profile\
    const profileRoutes = require('../src/Routes/profile.routes')
    app.use('/admin/profile',profileRoutes)

    //Education Admin
    const educationRoutes = require("../src/Routes/education.routes")
    app.use('/admin/education',educationRoutes)

    //Skill Admin
    const skillRoutes = require('../src/Routes/skill.routes')
    app.use('/admin/skill',skillRoutes)

    //Project Admin 
    const projectRoutes = require('../src/Routes/project.routes')

    app.use('/admin/project',projectRoutes)

    //Resume Admin
    const resumeRoutes = require('../src/Routes/resume.routes')
    app.use('/admin/resume',resumeRoutes)

    module.exports=app