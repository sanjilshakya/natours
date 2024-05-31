const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = require("./app");
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.DB.replace("<PASSWORD>", process.env.DB_PASSWORD))
  .then(() => {
    console.log("Database Connection Successful");
  })
  .catch((error) => {
    console.log("Could not connect to the database");
  });

app.listen(PORT, () => {
  console.log("Listening to the port:", PORT);
});
