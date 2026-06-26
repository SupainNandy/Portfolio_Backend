const express = require("express");
const profileModel = require("../Model/profile.model");
const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/auth.middleware");
const { uploadFile } = require("../config/imagekit");

const profileRouter = express.Router();


// Create Profile
profileRouter.post(
    "/",
    authMiddleware,
    upload.single("profilePicture"),
    async (req, res) => {
        try {

            const existingProfile = await profileModel.findOne();

            if (existingProfile) {
                return res.status(400).json({
                    message: "Profile already exists"
                });
            }

            let imageUrl = "";

            if (req.file) {
                imageUrl = await uploadFile(req.file);
            }

            const profile = await profileModel.create({
                ...req.body,
                profileImage: imageUrl
            });

            res.status(201).json({
                message: "Profile Created",
                profile
            });

        } catch (err) {

            console.log(err);

            res.status(500).json({
                message: "Internal Server Error"
            });

        }
    }
);


// Get Profile
profileRouter.get("/", async (req, res) => {

    try {

        const profile = await profileModel.findOne();

        res.status(200).json(profile);

    } catch (err) {

        res.status(500).json({
            message: "Internal Server Error"
        });

    }

});


// Update Profile
profileRouter.put(
    "/",
    authMiddleware,
    upload.single("profilePicture"),
    async (req, res) => {

        try {

            const profile = await profileModel.findOne();

            if (!profile) {

                return res.status(404).json({
                    message: "Profile not found"
                });

            }

            if (req.file) {

                const imageUrl = await uploadFile(req.file);

                profile.profileImage = imageUrl;

            }

            profile.name = req.body.name || profile.name;
            profile.title = req.body.title || profile.title;
            profile.bio = req.body.bio || profile.bio;
            profile.about = req.body.about || profile.about;
            profile.email = req.body.email || profile.email;
            profile.phone = req.body.phone || profile.phone;
            profile.address = req.body.address || profile.address;
            profile.github = req.body.github || profile.github;
            profile.linkedin = req.body.linkedin || profile.linkedin;
            profile.portfolio = req.body.portfolio || profile.portfolio;
            profile.twitter = req.body.twitter || profile.twitter;

            await profile.save();

            res.status(200).json({
                message: "Profile Updated Successfully",
                profile
            });

        } catch (err) {

            console.log(err);

            res.status(500).json({
                message: "Internal Server Error"
            });

        }

    }
);

module.exports = profileRouter;