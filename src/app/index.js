const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

// initialize the express app
const app = express();

// use middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cookieParser());

// routes import
const healthcheckRouter = require('../routes/healthcheck.routes.js');
const userRouter = require('../routes/user.routes.js');
const videoRouter = require('../routes/video.routes.js');
const subscriptionRouter = require('../routes/subscription.routes.js');
const commentRouter = require('../routes/comment.routes.js');
const likeRouter = require('../routes/like.routes.js');
const playlistRouter = require('../routes/playlist.routes.js');
const dashboardRouter = require('../routes/dashboard.routes.js');
const tweetRouter = require('../routes/tweet.routes.js');

// routes declaration
app.use('/api/v1/healthcheck', healthcheckRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/playlists', playlistRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/tweets', tweetRouter);

// Not Found Handler
app.use((_req, res) => {
  res.json({
    message: 'Resource Not Found',
    error: 'The requested resource does not exist',
    hints: 'Please check the URL and try again',
  });
});

module.exports = { app };
