const express = require("express");
const userRouter = express.Router();

//delete user API
userRouter.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).send("user not found");
    } else {
      res.send("user deleted successfully");
    }
  } catch (err) {
    res.status(404).json({
      status: false,
      message: err.message || "Something went wrong",
    });
  }
});

//update user API
userRouter.patch("/user/:userId", async (req, res) => {
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
    res.status(404).json({
      status: false,
      message: err.message || "Something went wrong",
    });
  }
});

module.exports = { userRouter };
