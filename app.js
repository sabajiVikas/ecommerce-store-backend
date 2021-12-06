// requiring
require("dotenv").config();
const express = require("express");
// fileupload
const fileupload = require("express-fileupload");
// cookie
const cookieParser = require("cookie-parser");
// morgan
const morgan = require("morgan");
// swagger
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

// routes
const home = require("./routes/home");
// swagger load
const swaggerDocument = YAML.load("./swagger.yaml");

// express init
const app = express();

// express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// fileuploader
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
// cookie
app.use(cookieParser());
// morgan
app.use(morgan("tiny"));
// swagger middleware
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// router middlewares
app.use("/api/v1", home);

// exporting
module.exports = app;
