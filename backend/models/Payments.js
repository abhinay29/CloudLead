const mongoose = require('mongoose');
const { Schema } = mongoose;

const Transactions = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  orderCreationId: {
    type: String,
    default: null
  },
  razorpayPaymentId: {
    type: String,
    default: null
  },
  razorpayOrderId: {
    type: String,
    default: null
  },
  razorpaySignature: {
    type: String,
    default: null
  },
  amount: {
    type: Number,
    required: true
  },
  orderId: {
    type: String,
    default: null
  },
  planId: {
    type: Number,
    required: true
  },
  planName: {
    type: String,
    required: true
  },
  status: {
    type: String,
    default: 'Pending',
  },
  date: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('transactions', Transactions);
