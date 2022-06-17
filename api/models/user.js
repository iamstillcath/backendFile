const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
  },
  password: { type: String, required: true, minlength:6 },
  role: { type: String, require: true },
  phoneNumber: { type: Number, required: true ,match: "@^(\d{10})$"},
  address: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
