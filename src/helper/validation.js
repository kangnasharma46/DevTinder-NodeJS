const validator = require("validator");

const SignupValidation = (req) => {
  const {
    firstName,
    lastName,
    emailId,
    password,
    age,
    gender,
    mobileNumber,
    skills,
  } = req;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!emailId || !validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  } else if (!password || !validator.isStrongPassword(password)) {
    throw new Error("password is not valid");
  } else if (!age) {
    throw new Error("age is not valid");
  } else if (!gender) {
    throw new Error("gender is not valid");
  } else if (!mobileNumber) {
    throw new Error("mobileNumber is not valid");
  }
};

const ProfileEditDataValidation = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "photoUrl",
    "gender",
    "age",
    "About",
    "skills",
  ];

  const isEditAllowed = Object.keys(req).every((field) =>
    allowedEditFields.includes(field),
  );
  return isEditAllowed;
};

module.exports = { SignupValidation, ProfileEditDataValidation };
