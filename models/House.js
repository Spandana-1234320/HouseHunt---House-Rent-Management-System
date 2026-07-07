const mongoose = require("mongoose");

const houseSchema = new mongoose.Schema({
  title: String,
  location: String,
  rent: Number,
  owner: String,
  image: String
});

module.exports = mongoose.model("House", houseSchema);