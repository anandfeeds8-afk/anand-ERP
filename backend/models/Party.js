const mongoose = require("mongoose");

const partySchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  contactPersonNumber: { type: String, required: true },
  address: { type: String, required: true },
  discount: { type: Number, required: true },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salesman",
    default: null,
  },
  approved: { type: Boolean, required: true, default: false },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null,
  },
  rejectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    default: null,
  },
  partyStatus: {
    type: String,
    enum: ["pending", "sentForApproval", "approved", "rejected"],
    default: "pending",
  },
  balance: {
    type: Number,
    required: true,
    default: 1000000,
    max: [1000000, "Balance cannot exceed 10 lakh"],
  },
});

const Party = mongoose.model("Party", partySchema);
module.exports = Party;
