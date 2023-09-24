const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
  return jwt.sign(
    { userId: this.userId, userEmail: this.userEmail },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

module.exports = mongoose.model("users", userSchema);
