const mongoose = require("mongoose");
// bcrypt
const bcrypt = require("bcryptjs");
// jsonwebtoken gen
const jwt = require("jsonwebtoken");
// crypto
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      maxlength: [40, "name should be under 40 characters..."],
      required: [true, "name is mandatory field..."],
    },
    email: {
      type: String,
      required: [true, "email is mandatory field..."],
      unique: true,
    },
    password: {
      type: String,
      minlength: [6, "password should be atleast 6 characters..."],
      required: [true, "password is mandatory field..."],
      select: false,
    },
    role: {
      type: String,
      default: "user",
    },
    photo: {
      id: {
        type: String,
        required: true,
      },
      secure_url: {
        type: String,
        required: true,
      },
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date,
    // createdAt: {
    //   type: Date,
    //   default: Date.now,
    // },
  },
  { timestamps: true }
);

// encrypt password before saving - LIFE CYCLE HOOKs(pre)
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// validate the password with passed on user password
userSchema.methods.isValidatedPassword = async function (userSentPassword) {
  return await bcrypt.compare(userSentPassword, this.password);
};

// create & return jwt token
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });
};

// generate forgot password token(string)
userSchema.methods.getForgotPasswordToken = function () {
  // generate a long & random string
  const forgotToken = crypto.randomBytes(20).toString("hex");

  // getting a hash(make sure to get hash on backend)
  this.forgotPasswordToken = crypto
    .createHash("sha256")
    .update(forgotToken)
    .digest("hex");

  // time of token
  this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

  return forgotToken;
};

module.exports = mongoose.model("User", userSchema);
