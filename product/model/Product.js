const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: String,
  description: String,
  price: Number,

  created_at: {
    type: Date,
    default: Date.now()
  }
})

module.exports = Product = mongoose.model("product", ProductSchema);