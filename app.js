const express = require("express");
const mongoose = require("mongoose");

const app = express();
const routes = require("./routes");
const users = require("./controllers/users");

const PORT = 3001;

const cors = require("cors");

app.use(cors());

app.use(express.json());
app.post("/signin", users.login);
app.post("/signup", users.createUser);
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
