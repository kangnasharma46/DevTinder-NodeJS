const mongoose = require("mongoose");

const connectDb = async () => {
  await mongoose.connect(
    "mongodb+srv://kangnasharma46:04JSbcw4BLjmAp8k@devtinder.xrfjxhj.mongodb.net/Devtinder",
  );
};
module.exports = connectDb;
