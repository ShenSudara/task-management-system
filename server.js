const app = require("./app");
const connectDatabase = require("./config/database-config");

require("dotenv").config({ path: "./config/.env" });

/**
 * starting point of the application
 */
const start = async () => {
  try {
    await connectDatabase(process.env.MONGO_URI);
    app.listen(process.env.APPLICATION_PORT, () => {
      console.log(
        `server is listening on port ${process.env.APPLICATION_PORT}...`
      );
      console.log("application is starting...");
    });
  } catch (error) {
    console.log(error);
  }
};

start();
