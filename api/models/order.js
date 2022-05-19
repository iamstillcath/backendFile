const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  destination: { type: String, required: true },
  status: { type: String, required: true },
  currentLocation: { type: String, required: true },
  user_id: {type: String, required: true }
});

module.exports = mongoose.model("Order", orderSchema);
