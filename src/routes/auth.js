const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { SignupValidation } = require("../helper/validation");
const User = require("../models/userModel");
//Signup API
authRouter.post("/signup", async (req, res, next) => {
  SignupValidation(req.body);

  const { firstName, lastName, emailId, password, age } = req.body;
  //Encrypt Password
  const hashPassword = await bcrypt.hash(password, 10);
  try {
    const userObj = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
      age,
    });
    const savedUser = await userObj.save();
    const token = await savedUser.getJWT();
    res.cookie("token", token);
    res.status(200).json({
      status: true,
      data: savedUser,
      message: "signup successfull",
    });
  } catch (err) {
    res.status(404).json({
      status: false,
      message: err.message || "Something went wrong",
    });
  }
});

//Login API
authRouter.post("/login", async (req, res, next) => {
  const { emailId, password } = req.body;
  //check whether user is present in DB or not
  try {
    const userData = await User.findOne({ emailId: emailId });
    if (!userData) {
      throw new Error("Invalid credentials.");
    }
    //check Valid password
    const isPassword = await userData.isValidPassword(password);
    const token = await userData.getJWT();
    //Send cookie to user
    if (!isPassword) {
      throw new Error("Invalid credentials.");
    } else {
      res.cookie("token", token);
      res.status(200).json({
        status: true,
        data: userData,
        message: "Login successfull",
      });
    }
  } catch (err) {
    res.status(404).json({
      status: false,
      message: err.message || "Something went wrong",
    });
  }
});

//Logout API
authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
  });
  res.json({
    status: true,
    message: "logout successfully!!!!",
  });
});

module.exports = { authRouter };
