const express = require("express");
const profileRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { userAuth } = require("../middelwares/auth");
const { ProfileEditDataValidation } = require("../helper/validation");
//Get Profile API

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    res.send(req.user);
  } catch (err) {
    res.status(404).json({
      status: false,
      message: err.message || "Something went wrong",
    });
  }
});

//Edit Profile API
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!ProfileEditDataValidation(req.body)) {
      throw new Error("Invalid request");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach(
      (keys) => (loggedInUser[keys] = req.body[keys]),
    );
    await loggedInUser.save();
    res.status(200).json({
      status: true,
      message: "profile edit successfully!!!!!",
    });
  } catch (err) {
    res.status(404).json({
      status: false,
      message: err.message || "Something went wrong",
    });
  }
});

//Change Password

profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
  try {
    if (req.body.password == null) {
      throw new Error("please enter password");
    }
    const loggedInUser = req.user;
    const hashPassword = await bcrypt.hash(req.body.password, 10);

    ((loggedInUser["password"] = hashPassword), await loggedInUser.save());
    res.status(200).json({
      status: true,
      message: "password updated successfully!!!!!",
    });
  } catch (err) {
    res.status(404).json({
      status: false,
      message: err.message || "Something went wrong",
    });
  }
});

module.exports = { profileRouter };
