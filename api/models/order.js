const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  itemDescription: { type: String, required: true },
  price: { type: Number, required: true },
  pickupLocation: { type: String, required: true },
  destination: { type: String, required: true },
  status: { type: String, required: true },
  currentLocation: { type: String, required: true },
  recipientName: { type: String, required: true },
  recipientNumber: { type: String , required: true ,
    minLength: 8,
    maxLength: 14,
    match: /^(\+|00)[0-9]{1,3}[0-9]{7,14}(?:x.+)?$/,
   },
  userId: {type: String}
});

module.exports = mongoose.model("Order", orderSchema);
