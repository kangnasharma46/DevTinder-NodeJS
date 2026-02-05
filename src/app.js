const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("welcome to test response!!!!");
});

app.use("/dash", (req, res) => {
  res.send("welcome dashboard!!!");
});

app.use("/", (req, res) => {
  res.send("welcome dashboard!!!");
});

app.listen(7777, () => {
  console.log("Server start succesfully!!!!");
});
