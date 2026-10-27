const express = require("express");
const mongoose = require('mongoose');
const app = express();
const userRoutes = require("./routes/users");
const clothingItemRoutes = require("./routes/clothingItems");

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.use((req, res, next) => {
  req.user = { _id: "" };
  next();
});

app.use(express.json());

app.use("/users", userRoutes);
app.use("/items", clothingItemRoutes);



mongoose.connect('mongodb://127.0.0.1:27017/wtwr_db');

const userSchema = new mongoose.Schema({
   name: {

  },
  avatar:{

  }
});

const itemSchema = new mongoose.Schema({
    name: {

    },
    weather: {

    },
    imageUrl: {

    },
    owner: {

    },
    likes: {

    },
    createdAt: {

    }
});

module.exports = mongoose.model('Item', itemSchema);