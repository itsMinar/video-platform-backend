const { Schema, model } = require('mongoose');

// create Subscription schema
const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId, // one who is subscribing
      ref: 'User',
    },
    channel: {
      type: Schema.Types.ObjectId, // one to whom 'subscriber' is subscribing
      ref: 'User',
    },
  },
  { timestamps: true }
);

// create Subscription model
const Subscription = model('Subscription', subscriptionSchema);

module.exports = { Subscription };
