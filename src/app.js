const express = require("express");

const app = express();
const connectDb = require("./config/database");
const User = require("./models/userModel");
const { SignupValidation } = require("./helper/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
//Add middelware orovided by express
app.use(express.json());
app.use(cookieParser());
//Signup API
app.post("/signup", async (req, res, next) => {
  SignupValidation(req.body);

  const {
    firstName,
    lastName,
    emailId,
    password,
    age,
    skills,
    mobileNumber,
    gender,
  } = req.body;
  //Encrypt Password
  const hashPassword = await bcrypt.hash(password, 10);
  try {
    const userObj = new User({
      firstName,
      lastName,
      emailId,
      password: hashPassword,
      age,
      skills,
      mobileNumber,
      gender,
    });

    await userObj.save();
    res.send("user saved successfully");
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message || "Something went wrong",
    });
  }
});

//Login APIoooooo
app.post("/login", async (req, res, next) => {
  const { emailId, password } = req.body;
  console.log(req.body);
  //check whether user is present in DB or not
  try {
    const userData = await User.findOne({ emailId: emailId });
    if (!userData) {
      throw new Error("Invalid credentials.");
    }
    //check Valid password
    const isPassword = bcrypt.compare(password, userData.password);
    const token = await jwt.sign({ _id: userData.id }, "devtinder@1102");
    //Send cookie to user
    if (!isPassword) {
      throw new Error("Invalid credentials.");
    } else {
      res.cookie("token", token);
      res.send("Login Succesfull");
    }
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message || "Something went wrong",
    });
  }
});

//Get Profile API

app.get("/profile", async (req, res) => {
  const cookies = req.cookies;
  const { token } = cookies;
  try {
    if (!token) {
      throw new Error("invalid token");
    }
    const decodeCookie = await jwt.verify(token, "devtinder@1102");
    const { _id } = decodeCookie;
    const userData = await User.findById(_id);
    console.log(_id);
    if (!userData) {
      throw new Error("user does not exists");
    } else {
      res.send(userData);
    }
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message || "Something went wrong",
    });
  }
});

//get user API
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
      res.status(404).send("user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message || "Something went wrong",
    });
  }
});

//get all user API
app.get("/getAllUser", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({});
    if (!user) {
      res.status(404).send("no user not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message || "Something went wrong",
    });
  }
});

//delete user API
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).send("user not found");
    } else {
      res.send("user deleted successfully");
    }
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message || "Something went wrong",
    });
  }
});

//update user API
app.patch("/user/:userId", async (req, res) => {
  const userData = req.body;
  const userId = req.params?.userId;
  try {
    const AVAILABLE_UPADTE = [
      "password",
      "age",
      "mobileNumber",
      "profilePic",
      "About",
      "skills",
    ];
    const isUpdatedAllowed = Object.keys(userData).every((k) =>
      AVAILABLE_UPADTE.includes(k),
    );
    if (!isUpdatedAllowed) {
      // res.status(400).send("update not allowed");
      throw new Error("update not allowed");
    }
    if (userData.skills?.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, userData, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!user) {
      res.status(404).send("user not found");
    } else {
      res.send("user updated successfully");
    }
  } catch (err) {
    res.status(400).json({
      status: false,
      message: err.message || "Something went wrong",
    });
  }
});

connectDb()
  .then(() => {
    console.log("db successfully connected");
    app.listen(7777, () => {
      console.log("Server start succesfully!!!!");
    });
  })
  .catch(() => {
    console.log("db not connected");
  });
