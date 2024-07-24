const { Schema, model } = require('mongoose');

// create Tweet schema
const tweetSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, 'Tweet Content is Required!'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

// create Tweet model
const Tweet = model('Tweet', tweetSchema);

module.exports = { Tweet };
