const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/**
 * This file includes a mongoose model for the users.
 * this have following functions
 * functions related to mongoose model
 * create automatic id when user saving
 * create a hash for the password when user saving
 * user verify function for user logging
 * create jwt token for the user for manage the session
 * save a token for the user when user registering to verify the user
 * create a login url for the user registration
 *
 */

const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
  },

  userFirstName: {
    type: String,
    required: [true, "please provide a name"],
    maxlength: 25,
    minlength: 2,
    match: [/[a-z ,.'-]+$/, "please provide a valid name"],
  },

  userLastName: {
    type: String,
    required: [true, "please provide a name"],
    maxlength: 25,
    minlength: 2,
    match: [/[a-z ,.'-]+$/, "please provide a valid name"],
  },

  userEmail: {
    type: String,
    required: true,
    maxlength: 255,
  },

  userPassword: {
    type: String,
    required: true,
  },

  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },

  lastVerifyToken: {
    type: String,
  },

  lastCreated: {
    type: Date,
    default: new Date(),
  },

  lastUpdated: {
    type: Date,
    default: new Date(),
  },

  activeStatus: {
    type: Boolean,
    default: true,
  },
});

//Create a auto increment id
userSchema.pre("save", async function () {
  const userId = await this.constructor
    .findOne()
    .sort({ userId: -1 })
    .limit(1)
    .select("userId");
  this.userId = (userId ? userId.userId : 0) + 1;
});

//Create a hash for password using bcrypt
userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.userPassword = await bcrypt.hash(this.userPassword, salt);
});

//verify the user
userSchema.methods.verifyUser = async function (userEmail, userPassword) {
  if (
    this.userEmail == userEmail &&
    (await bcrypt.compare(userPassword, this.userPassword))
  ) {
    return true;
  }
  return null;
};

//Create a json web token for user
userSchema.methods.createJwt = async function () {
  return await jwt.sign(
    { userId: this.userId, userEmail: this.userEmail },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

//create a verification url for the user
userSchema.pre("save", async function () {
  const token = await crypto.randomUUID();
  this.lastVerifyToken = token;
});

userSchema.methods.createVerifyToken = async function () {
  return `http://localhost:3000/api/v1/auth/confirm?token=${this.lastVerifyToken}`;
};
module.exports = mongoose.model("users", userSchema);
