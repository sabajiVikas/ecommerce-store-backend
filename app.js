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
const user = require("./routes/user");
const product = require("./routes/product");
const payment = require("./routes/payment");
const order = require("./routes/order");
// swagger load
const swaggerDocument = YAML.load("./swagger.yaml");

// express init
const app = express();

// ejs
app.set("view engine", "ejs");

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
app.get("/", (req, res) =>
  res.status(200).json({
    success: true,
    message: "Welcome to Ecommerce Store Backend",
  })
);

app.use("/api/v1", home);
app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", payment);
app.use("/api/v1", order);

// ejs
app.get("/signup", (req, res) => res.render("signup"));

// exporting
module.exports = app;
