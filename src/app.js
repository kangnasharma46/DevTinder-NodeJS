require("dotenv").config();
const express = require("express");
require("./utils/cronjob");
const app = express();
const connectDb = require("./config/database");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { profileRouter } = require("./routes/profile");
const { authRouter } = require("./routes/auth");
const { userRouter } = require("./routes/user");
const { requestRouter } = require("./routes/request");
const paymentRouter = require("./routes/payment");
//Add middelware orovided by express
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", userRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

connectDb()
  .then(() => {
    console.log("db successfully connected");
    app.listen(7777, () => {
      console.log("Server start succesfully!!!! ,7777");
    });
  })
  .catch(() => {
    console.log("db not connected");
  });
