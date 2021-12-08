// requiring
require("dotenv").config();
require("./config/database").connectWithDB();
const cloudinary = require("cloudinary");
const app = require("./app");

// cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(process.env.PORT, () =>
  console.log(
    `SERVER IS UP & RUNNING AT http://127.0.0.1:${process.env.PORT} ...`
  )
);
