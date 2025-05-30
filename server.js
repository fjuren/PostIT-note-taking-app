const app = require('./app');
const mongoose = require('mongoose');

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
  // connect to Mongo
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.error(err));
  // start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
