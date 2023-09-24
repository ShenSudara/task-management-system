const mongoose = require("mongoose");
const connectDatabase = async (url) => {
  return await mongoose.connect(url);
};

module.exports = connectDatabase;
