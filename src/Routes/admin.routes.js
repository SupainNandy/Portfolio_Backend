const express = require("express");
const adminModel = require("../Model/admin.model");
const upload = require("../middleware/upload");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { uploadFile } = require("../config/imagekit");

const adminRouter = express.Router();

adminRouter.post(
    "/signup",
    upload.single("profilePicture"),
    async (req, res) => {
        try {
            const { name, email, password } = req.body;

            const user = await adminModel.findOne({email})

            if(user){
                return res.status(402).json({message:"User already exist"})
            }

            if (!req.file) {
                return res.status(400).json({
                    message: "Profile picture is required"
                });
            }

            const imageUrl = await uploadFile(req.file);

            const hasspass = await bcrypt.hash(password,10)
            const admin = await adminModel.create({
                name,
                email,
                password:hasspass,
                profilePicture: imageUrl
            });

            res.status(201).json({
                message: "Admin created successfully",
                admin
            });

        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: "Internal server error"
            });
        }
    }
);

//Admin LOGIN
adminRouter.post("/login",async(req,res)=>{
    try{
        const {email,password}=req.body
        if(!email || !password){
            res.status(403).json({message:"Admin email.password is required"})
        }

        const admin = await adminModel.findOne({email})

        if(!admin){
            return res.status(402).json({message:"email not found"})
        }
        const comPass = await bcrypt.compare(password,admin.password)

        if(!comPass){
            return res.status(401).json({message:"imvalid password"})
        }

        const token = jwt.sign({
            user_id: admin._id,
            username: admin.name
        },process.env.JWT_SKEY,{expiresIn:"1d"})

        res.cookie("adminToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
});

        res.status(200).json({
            mesaage:"User login successguly",admin
        })

    }catch(err){
        console.log(err.message)
        console.log("User login error")
        res.status(500).json({error:"Internal server error"})
    }
})

module.exports = adminRouter;