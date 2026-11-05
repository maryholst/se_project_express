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

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to MongoDB:", err);
    process.exit(1);
  });