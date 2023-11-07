require('dotenv').config();

const { app } = require('./app');
const connectDB = require('./db');

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at PORT: ${PORT} 🚀`);
    });
  })
  .catch((err) => {
    console.log('MONGODB Connection Failed!!', err);
  });
