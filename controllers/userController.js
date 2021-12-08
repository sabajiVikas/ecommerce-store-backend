const User = require("../models/user");

const cloudinary = require("cloudinary");

const BigPromise = require("../middlewares/bigPromise");
const cookieToken = require("../utils/cookieToken");
const mailHelper = require("../utils/mailHelper");
const crypto = require("crypto");

// users
exports.signup = BigPromise(async (req, res, next) => {
  if (!req.files) {
    return next(new Error("profile picture is required for signup..."));
  }

  const { name, email, password } = req.body;

  if (!email || !name || !password) {
    return next(new Error("name, email & password are required..."));
  }

  let file = req.files.photo;

  let result = await cloudinary.v2.uploader.upload(file.tempFilePath, {
    folder: "ecommUserProfilePics",
  });

  const user = await User.create({
    name,
    email,
    password,
    photo: {
      id: result.public_id,
      secure_url: result.secure_url,
    },
  });

  cookieToken(user, res);
});

exports.signin = BigPromise(async (req, res, next) => {
  const { email, password } = req.body;

  // check for presence of email & password
  if (!email || !password) {
    return next(new Error("please provide email & password..."));
  }

  // get user from database
  const user = await User.findOne({ email }).select("+password");
  // console.log(user);

  // if user not found in database
  if (!user) {
    return next(new Error("email or password doesn't match or exists"));
  }

  // match password
  const isPasswordCorrect = await user.isValidatedPassword(password);

  // password do not match
  if (!isPasswordCorrect) {
    return next(new Error("email or password doesn't match or exists"));
  }

  // if all goes good then send token
  cookieToken(user, res);
});

exports.signout = BigPromise(async (req, res, next) => {
  res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true });

  res.status(200).json({
    success: true,
    message: "signout successful",
  });
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
  // collect email
  const { email } = req.body;

  // find user in database
  const user = await User.findOne({ email });

  // user not found in database
  if (!user) {
    return next(new Error("email not found..."));
  }

  // get token from user model methods
  const forgotToken = user.getForgotPasswordToken();

  // save user fields database
  await user.save({ validateBeforeSave: false });

  // create a URL
  const backUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${forgotToken}`;

  // craft message
  const message = `copy paste this link in browser url & hit enter \n\n ${backUrl}`;

  // attempt to send mail
  try {
    await mailHelper({
      email: user.email,
      subject: "ecomm - password reset mail",
      message,
    });

    // json response if mail is success
    res.status(200).json({ success: true, message: "mail sent successfully" });
  } catch (error) {
    // reset user fields if things goes wrong
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new Error(error.message));
  }
});

exports.passwordReset = BigPromise(async (req, res, next) => {
  const token = req.params.token;

  const encryToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    encryToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new Error("token is invalid or expired..."));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new Error("password & confirm password doesn't match..."));
  }

  user.password = req.body.password;

  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;

  await user.save({ validateBeforeSave: false });

  // send a json response or send message
  cookieToken(user, res);
});

exports.getSignedInUserInfo = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

exports.changePassword = BigPromise(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("+password");

  const isCorrectOldPassword = await user.isValidatedPassword(
    req.body.oldPassword
  );

  if (!isCorrectOldPassword) {
    return next(new Error("old password is incorrect..."));
  }

  user.password = req.body.password;

  await user.save();

  cookieToken(user, res);
});

exports.updateUserInfo = BigPromise(async (req, res, next) => {
  if (!req.body.email || !req.body.name) {
    return next(new Error("provide information to update..."));
  }

  const newData = {
    name: req.body.name,
    email: req.body.email,
  };

  if (req.files) {
    const user = await User.findById(req.user._id);

    const imageId = user.photo.id;

    // delete photo on cloudinary
    await cloudinary.v2.uploader.destroy(imageId);

    // upload new photo
    let result = await cloudinary.v2.uploader.upload(
      req.files.photo.tempFilePath,
      {
        folder: "ecommUserProfilePics",
      }
    );

    newData.photo = {
      id: result.public_id,
      secure_url: result.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user._id, newData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// admin
exports.adminGetUsers = BigPromise(async (req, res, next) => {
  const users = await User.find({ role: { $ne: "admin" } });

  res.status(200).json({
    success: true,
    users,
  });
});

exports.adminGetUser = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    next(new Error("user not found"));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

exports.adminUpdateUser = BigPromise(async (req, res, next) => {
  if (!req.body.email || !req.body.name) {
    return next(new Error("provide information to update..."));
  }

  const newData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newData, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

exports.adminDeleteUser = BigPromise(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new Error("user not found"));
  }

  const imageId = user.photo.id;

  await cloudinary.v2.uploader.destroy(imageId);

  await user.remove();

  res.status(200).json({
    success: true,
    message: "user deleted successfully...",
  });
});

// manager
exports.managerGetUsers = BigPromise(async (req, res, next) => {
  const users = await User.find({ role: "user" });

  res.status(200).json({
    success: true,
    users,
  });
});
