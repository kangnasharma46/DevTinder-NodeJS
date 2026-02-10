const adminAuth = (req, res, next) => {
  const token = "xyzsfasf";
  const isAuthorize = token == "xyz";
  if (isAuthorize) {
    console.log("admin authorize");
    next();
  } else {
    console.log("admin authorize error");
    res.status(404).send("unauthorize user");
  }
};

const userAuth = (req, res, next) => {
  const token = "xyz";
  const isAuthorize = token == "xyz";
  if (isAuthorize) {
    console.log("user authorize");
    next();
  } else {
    console.log("user unauthorize error");
    res.status(404).send("unauthorize user");
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
