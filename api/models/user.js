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
  password: { type: String, required: true, minLength: 6 },
  confirmPassword: { type: String, required: true },
  role: { type: String, require: true },
  phoneNumber: {
    type: String,
    required: true,
    minLength: 8,
    maxLength: 14,
    match: /^(\+|00)[0-9]{1,3}[0-9]{4,14}(?:x.+)?$/,
  },
  address: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
