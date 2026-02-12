const express = require("express");

const app = express();
const connectDb = require("./config/database");
const User = require("./models/userModel");
const { default: mongoose } = require("mongoose");

//Add middelware orovided by express
app.use(express.json());

//Signup API
app.post("/signup", async (req, res, next) => {
  const userObj = new User(req.body);
  await userObj.save();
  res.send("user saved successfully");
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
    res.status(404).send("something went wrong");
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
    res.status(404).send("something went wrong");
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
    res.status(404).send("something went wrong");
  }
});

//update user API
app.patch("/user", async (req, res) => {
  const userData = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.body.userId },
      userData,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
    if (!user) {
      res.status(404).send("user not found");
    } else {
      res.send("user updated successfully");
    }
  } catch (err) {
    res.status(404).send("something went wrong");
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
