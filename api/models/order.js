const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  product: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  destination: { type: String, required: true },
  status: { type: String, required: true },
  currentLocation: { type: String, required: true },
  recipientName: { type: String, required: true },
  recipientNumber: { type: String , required: true },
  user_Id: {type: String}
});

module.exports = mongoose.model("Order", orderSchema);
