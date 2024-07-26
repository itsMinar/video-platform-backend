const { Schema, model } = require('mongoose');
const mongooseAggregatePaginate = require('mongoose-aggregate-paginate-v2');

// create Playlist schema
const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Playlist name Content is Required!'],
    },
    description: {
      type: String,
      required: [true, 'Playlist description Content is Required!'],
    },
    videos: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Video',
      },
    ],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

playlistSchema.plugin(mongooseAggregatePaginate);

// create Playlist model
const Playlist = model('Playlist', playlistSchema);

module.exports = { Playlist };
