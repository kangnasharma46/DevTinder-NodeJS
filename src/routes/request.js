const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middelwares/auth");
const ConnectionRequest = require("../models/connectionrequest");
const user = require("../models/userModel");

//intersted and ignore requested api
requestRouter.post(
  "/send/request/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const status = req.params.status;
      const toUserId = req.params.toUserId;

      //check status
      const allowedStatus = ["ignored", "intersted"];
      if (!allowedStatus) {
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

module.exports = { requestRouter };
