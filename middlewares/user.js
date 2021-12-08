const jwt = require("jsonwebtoken");

const BigPromise = require("../middlewares/bigPromise");
const User = require("../models/user");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
  const token =
    req.cookies.token || req.header("Authorization").replace("Bearer ", "");

  if (!token) {
    return next(new Error("signin first to access this resource..."));
  }

  const decode = await jwt.verify(token, process.env.JWT_SECRET);
  // console.log(decode);

  req.user = await User.findById(decode.id);

  next();
});

exports.customRole = (...roles) => {
  // if (req.user.role === "admin") {
  //   next();
  // }

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new Error("unauthorized not allowed for requested resource...")
      );
    }

    next();
  };
};
