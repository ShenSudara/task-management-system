const mongoose = require("mongoose");

/**Create a mongo db connection
 *
 * This function return a connection object of mongo db
 * @param {mongo db connection string} url
 * @returns mongodb connection object
 */
const connectDatabase = async (url) => {
  return await mongoose.connect(url);
};

module.exports = connectDatabase;
