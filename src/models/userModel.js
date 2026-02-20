const { JsonWebTokenError } = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
      minlenght: 10,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    emailId: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Not a valid emailId" + value);
        }
      },
    },
    password: {
      type: String,
      require: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("is not a strong password" + value);
        }
      },
    },
    age: {
      type: Number,
      require: true,
      trim: true,
    },
    gender: {
      type: String,
      require: true,
      validate(value) {
        if (!["Male", "Female", "Others"].includes(value)) {
          throw new Error("Gender data is not correct");
        }
      },
      trim: true,
    },
    mobileNumber: {
      type: Number,
      require: true,
      trim: true,
    },
    profilePic: {
      type: String,
      require: true,
      default:
        "https://media.istockphoto.com/id/1495088043/vector/user-profile-icon-avatar-or-person-icon-profile-picture-portrait-symbol-default-portrait.jpg?s=1024x1024&w=is&k=20&c=oGqYHhfkz_ifeE6-dID6aM7bLz38C6vQTy1YcbgZfx8=",
    },
    About: {
      type: String,
      require: true,
      default: "Hello Default values!!!!!!!!!",
      trim: true,
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true },
);

userSchema.methods.getJWT = async function () {
  const user = this;

  const token = await jwt.sign({ _id: user._id }, "devtinder@1102", {
    expiresIn: "7d",
  });

  return token;
};

userSchema.methods.isValidPassword = async function (passwordInput) {
  const user = this;
  const hashPassword = user.password;

  const isPassword = await bcrypt.compare(passwordInput, hashPassword);
  return isPassword;
};

const user = mongoose.model("User", userSchema);
module.exports = user;
