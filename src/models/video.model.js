const { Schema, model } = require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');

const videoSchema = new Schema(
  {
    videoFile: {
      type: String,
      required: [true, 'Video file is Required!'],
    },
    thumbnail: {
      type: String,
      required: [true, 'Video thumbnail is Required!'],
    },
    title: {
      type: String,
      required: [true, 'Video title is Required!'],
    },
    description: {
      type: String,
      required: [true, 'Video description is Required!'],
    },
    duration: {
      type: Number,
      required: [true, 'Video duration is Required!'],
    },
    views: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

videoSchema.plugin(mongooseAggregatePaginate);

const Video = model('Video', videoSchema);

module.exports = { Video };
