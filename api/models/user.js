const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(v);
      },
      message: (props) => `Enter a valid ${props.path} address!`,
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  confirmPassword: { type: String, required: true },
  phoneNumber: {
    type: String,
    required: true,
    unique: false,
    validate: {
      validator: function (v) {
        return /^(\+|00)[0-9]{1,3}[0-9]{7,14}(?:x.+)?$/.test(v);
      },
      message: (props) =>
        `${props.path} should be atleast (8)characters! & should contain a country code`,
    },
    minLength: 8,
    maxLength: 14,
  },
  address: { type: String, required: true },
});

module.exports = mongoose.model("User", userSchema);
