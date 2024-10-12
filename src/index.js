require('dotenv').config();

const { app } = require('./app');
const connectDB = require('./db');
const logger = require('./logger/winston.logger');

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`⚙️  Server is running on PORT: ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    logger.error('MONGODB Connection Failed!!', err);
  });
