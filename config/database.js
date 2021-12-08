const mongoose = require("mongoose");

exports.connectWithDB = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => console.log("MONGODB CONNECTED SUCCESSFULLY"))
    .catch((err) => {
      console.log("MONGODB FAILED TO CONNECT");
      console.log(err);
      process.exit(1);
    });
};
