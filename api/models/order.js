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
    unique: false,
    validate: {
      validator: function (v) {
        return /^(\+|00)[0-9]{1,3}[0-9]{7,14}(?:x.+)?$/.test(v);
      },
      message: (props) =>
        `${props.path} should be atleast (8)characters! & should contain a country code`,
    },
    minLength: 7,
    maxLength: 14,
   
   },
  userId: {type: String}
});

module.exports = mongoose.model("Order", orderSchema);
