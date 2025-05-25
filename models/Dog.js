const mongoose = require("mongoose");

const dogSchema = new mongoose.Schema({
  name: { type: String, required: true },
  breed: { type: String, required: true },
  age: { type: Number, required: true },
  adopted: { type: Boolean, default: false },
  description: { type: String },
  image: { type: String },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  adoptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  thankYouMessage: {
    type: String,
    default: "",
  }
}, { timestamps: true });

module.exports = mongoose.model("Dog", dogSchema);
