// requiring
require("dotenv").config();
const app = require("./app");

app.listen(process.env.PORT, () =>
  console.log(
    `SERVER IS UP & RUNNING AT http://127.0.0.1:${process.env.PORT} ...`
  )
);
