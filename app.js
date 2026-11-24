const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const routes = require("./routes");

const PORT = 3001;

app.use(cors());

app.use(express.json());
app.use(routes);

mongoose
  .connect("mongodb://localhost:27017/wtwr_db")
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to MongoDB:", err);
    process.exit(1);
  });
