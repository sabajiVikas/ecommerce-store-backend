const express = require("express");
const router = express.Router();

const {
  signup,
  signin,
  signout,
  forgotPassword,
  passwordReset,
  getSignedInUserInfo,
  changePassword,
  updateUserInfo,
  adminGetUsers,
  adminGetUser,
  adminUpdateUser,
  adminDeleteUser,
  managerGetUsers,
} = require("../controllers/userController");
const { isLoggedIn, customRole } = require("../middlewares/user");

// users
router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/signout").get(signout);
router.route("/forgotPassword").post(forgotPassword);
router.route("/password/reset/:token").post(passwordReset);
router.route("/userDashboard").get(isLoggedIn, getSignedInUserInfo);
router.route("/password/update").post(isLoggedIn, changePassword);
router.route("/userDashboard/update").post(isLoggedIn, updateUserInfo);

// admin
router
  .route("/admin/users")
  .get(isLoggedIn, customRole("admin"), adminGetUsers);
router
  .route("/admin/user/:id")
  .get(isLoggedIn, customRole("admin"), adminGetUser)
  .put(isLoggedIn, customRole("admin"), adminUpdateUser)
  .delete(isLoggedIn, customRole("admin"), adminDeleteUser);

// manager
router
  .route("/manager/users")
  .get(isLoggedIn, customRole("manager"), managerGetUsers);

module.exports = router;
