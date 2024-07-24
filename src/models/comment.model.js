const { Schema, model } = require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');

// create Comment schema
const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, 'Comment Content is Required!'],
    },
    video: {
      type: Schema.Types.ObjectId,
      ref: 'Video',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

commentSchema.plugin(mongooseAggregatePaginate);

// create Comment model
const Comment = model('Comment', commentSchema);

module.exports = { Comment };
