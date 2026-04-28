const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../../src/middelwares/auth");
const ConnectionRequest = require("../../src/models/connectionrequest");
const user = require("../../src/models/userModel");

//intersted and ignore requested api
requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const status = req.params.status;
      const toUserId = req.params.userId;

      //check status
      const allowedStatus = ["ignored", "intersted"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status");
      }

      //to check if valid user
      const validUser = await user.findById(toUserId);
      if (!validUser) {
        throw new Error("User not exists");
      }

      if (fromUserId.equals(toUserId)) {
        throw new Error("Cannot send connection request to yourself!");
      }

      //if connection already exists in DB dont create other copy
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        throw new Error("connection request already exists");
      }

      const conReq = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await conReq.save();
      res.json({
        message: "request send successfully!!!!",
        data: data,
      });
    } catch (err) {
      res.status(404).json({
        status: false,
        message: err.message || "Something went wrong",
      });
    }
  },
);

//intersted review api
requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        throw new Error("Invalid status type");
      }
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(404)
          .json({ message: "Connection request not found" });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: "Connection request " + status,
        data: data,
      });
    } catch (err) {
      res.status(404).json({
        status: false,
        message: err.message || "Something went wrong",
      });
    }
  },
);

module.exports = { requestRouter };
