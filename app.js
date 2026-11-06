const express = require("express");
const mongoose = require("mongoose");

const app = express();
const userRoutes = require("./routes/users");
const clothingItemRoutes = require("./routes/clothingItems");

const PORT = 3001;

app.use((req, res, next) => {
  req.user = { _id: "6ae0b5adb6df94660274a4e8" };
  next();
});

app.use(express.json());

app.use("/users", userRoutes);
app.use("/items", clothingItemRoutes);

app.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).send({ message: "Invalid JSON body" });
  }
  return next(err);
});

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  return res
    .status(500)
    .send({ message: "An error has occurred on the server." });
});

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