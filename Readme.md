// const { adminAuth, userAuth } = require("./middelwares/auth");

// app.get("/admin/getAllData", adminAuth, (req, res, next) => {
// res.send("admin get all data");
// });

// app.get("/user/login", userAuth, (req, res, next) => {
// res.send(" user data");
// });

// app.get("/admin/deleteData", (req, res, next) => {
// res.send("delete user data");
// });

// app.use("/", (err, req, res, next) => {
// if (err) {
// res.status(500).send("something went wrong");
// }
// });

//Next Functionality to move to next router

// app.get(
// "/user",
// (req, res, next) => {
// console.log("first send calles");
// // res.send("Response 1");
// next();
// },
// (req, res, next) => {
// console.log("first send calles");
// res.send("Response 2");
// },
// );

//Get-POST-DELETE-PUT API CALLS

// app.get("/user", (req, res) => {
// res.send({ firstname: "Kangna", lastname: "Sharma" });
// });

// app.post("/user", (req, res) => {
// res.send("post called successfully");
// });

// app.delete("/user", (req, res) => {
// res.send("delete called successfully");
// });

// app.patch("/user", (req, res) => {
// res.send("patch called successfully");
// });

// app.use("/test", (req, res) => {
// res.send("welcome to test response!!!!");
// });
