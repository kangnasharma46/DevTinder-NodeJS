const express = require("express");
const { userAuth } = require("../middelwares/auth");
const ConnectionRequest = require("../models/connectionrequest");
const user = require("../models/userModel");
const userRouter = express.Router();

//get all  user  request API
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);
    if (!connectionRequests) {
      throw new Error("connection not found");
    }
    res.json({
      message: "data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(404).json({
      status: false,
      message: err.message || "Something went wrong",
    });
  }
});
//get all  user  connections API
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    console.log(connectionRequests);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

//get all feed
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("toUserId fromUserId");

    const hideUsersFromFeed = new Set();
    connectionRequest.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });
    const users = await user
      .find({
        $and: [
          { _id: { $nin: Array.from(hideUsersFromFeed) } },
          { _id: { $ne: loggedInUser._id } },
        ],
      })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);
    console.log(user.countDocuments.length);
    if (user.length > 0) {
      res.json({
        status: true,
        users,
      });
    } else {
      res.json({
        status: false,
        message: "No user found",
      });
    }
  } catch (err) {
    res.status(404).json({
      status: false,
      message: err.message || "Something went wrong",
    });
  }
});

module.exports = { userRouter };
