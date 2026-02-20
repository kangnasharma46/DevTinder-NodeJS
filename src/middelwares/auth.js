const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    if (!token) {
      throw new Error("Invalid token!!!");
    }
    const decodeData = await jwt.verify(token, "devtinder@1102");
    const { _id } = decodeData;
    const userData = await User.findById(_id);
    if (!userData) {
      throw new Error("user not found");
    }
    req.user = userData;
    next();
  } catch (err) {
    res.status(404).json({
      status: false,
      message: err.message || "Something went wrong",
    });
  }
};

module.exports = {
  userAuth,
};
