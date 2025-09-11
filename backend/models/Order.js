const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
  totalAmount: { type: Number, required: true },
  advanceAmount: { type: Number, default: 0 },
  dueAmount: { type: Number },
  dueDate: { type: Date },
  paymentMode: {
    type: String,
    enum: ["UPI", "Cash", "Bank Transfer", "Not Paid"],
  },
  invoicedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Accountant" },
  party: { type: mongoose.Schema.Types.ObjectId, ref: "Party", required: true },
  generatedAt: { type: Date, default: Date.now },
});

const dueInvoiceSchema = new mongoose.Schema({
  totalAmount: { type: Number, required: true },
  advanceAmount: { type: Number, default: 0 },
  dueAmount: { type: Number },
  dueDate: { type: Date },
  paymentMode: {
    type: String,
    enum: ["UPI", "Cash", "Bank Transfer", "Not Paid"],
  },
  invoicedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Accountant" },
  party: { type: mongoose.Schema.Types.ObjectId, ref: "Party", required: true },
  generatedAt: { type: Date, default: Date.now },
});

const OrderSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  quantity: { type: Number, required: true, min: 1 },
  totalAmount: { type: Number, required: true },
  advanceAmount: { type: Number, default: 0 },
  dueAmount: { type: Number },
  dueDate: { type: Date },
  paymentMode: {
    type: String,
    enum: ["UPI", "Cash", "Bank Transfer", "Not Paid"],
  },
  notes: { type: String },

  // Status & Tracking
  orderStatus: {
    type: String,
    enum: [
      "Placed",
      "ForwardedToAuthorizer",
      "SentForApproval",
      "WarehouseAssigned",
      "Approved",
      "ForwardedToPlantHead",
      "Dispatched",
      "Delivered",
      "Cancelled",
    ],
    default: "Placed",
  },
  advancePaymentStatus: {
    type: String,
    enum: ["Pending", "SentForApproval", "Approved", "Rejected"],
  },
  duePaymentStatus: {
    type: String,
    enum: ["Pending", "SentForApproval", "Approved", "Rejected"],
  },
  advancePaymentApprovalSentTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Accountant",
  },
  duePaymentApprovalSentTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Accountant",
  },
  paymentStatus: {
    type: String,
    enum: ["Unpaid", "Partial", "Paid"],
    default: "Unpaid",
  },
  invoiceGenerated: { type: Boolean, default: false },
  dueInvoiceGenerated: { type: Boolean, default: false },
  salesmanReceived: { type: Boolean, default: false },

  // Relational Mapping (Steps)
  placedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Salesman",
    required: true,
  },
  forwardedByManager: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SalesManager",
  },
  forwardedByAuthorizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SalesAuthorizer",
  },
  warehouseAssignedByAuthorizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SalesAuthorizer",
  },
  assignedWarehouse: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "SalesAuthorizer" },
  invoicedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Accountant" },
  paymentCollectedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Salesman" },
  advancePaymentApprovedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Accountant",
  },
  duePaymentApprovedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Accountant",
  },

  dispatchInfo: {
    dispatchedBy: { type: mongoose.Schema.Types.ObjectId, ref: "PlantHead" },
    dispatchDate: Date,
    vehicleNumber: String,
    driverName: String,
    driverContact: String,
    transportCompany: String,
    dispatchDocs: String,
  },

  // OrderSchema.js (add inside OrderSchema)
  canceledBy: {
    role: {
      type: String,
      enum: [
        "Admin",
        "Salesman",
        "SalesManager",
        "SalesAuthorizer",
        "PlantHead",
      ],
      default: null,
    },
    user: { type: mongoose.Schema.Types.ObjectId, refPath: "canceledBy.role" },
    reason: String,
    date: Date,
  },

  advancePaymentDoc: { type: String },
  duePaymentDoc: { type: String },

  // Party Info
  party: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Party",
    required: true,
  },

  invoiceDetails: {
    type: invoiceSchema,
  },

  dueInvoiceDetails: {
    type: dueInvoiceSchema,
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", OrderSchema);
