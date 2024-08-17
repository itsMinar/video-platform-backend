const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const CustomError = require('../utils/Error.js');
const errorMiddleware = require('../middlewares/error.middleware.js');

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
const userRouter = require('../routes/user.routes.js');
const videoRouter = require('../routes/video.routes.js');
const subscriptionRouter = require('../routes/subscription.routes.js');
const commentRouter = require('../routes/comment.routes.js');
const likeRouter = require('../routes/like.routes.js');
const playlistRouter = require('../routes/playlist.routes.js');
const dashboardRouter = require('../routes/dashboard.routes.js');
const tweetRouter = require('../routes/tweet.routes.js');

// routes declaration
app.use('/api/v1/users', userRouter);
app.use('/api/v1/videos', videoRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/likes', likeRouter);
app.use('/api/v1/playlists', playlistRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/tweets', tweetRouter);

// health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 Catalog Service is up and running',
  });
});

// Not Found Handler
app.use((_req, res) => {
  const error = CustomError.notFound({
    message: 'Resource Not Found',
    errors: ['The requested resource does not exist'],
    hints: 'Please check the URL and try again',
  });
  res.status(error.status).json({ ...error, status: undefined });
});

// Global Error Handler
app.use(errorMiddleware);

module.exports = { app };
