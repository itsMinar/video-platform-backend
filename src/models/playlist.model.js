const { Schema, model } = require('mongoose');

// create Playlist schema
const playlistSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
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

// create Playlist model
const Playlist = model('Playlist', playlistSchema);

module.exports = { Playlist };
