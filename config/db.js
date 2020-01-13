const mongoose = require('mongoose');
const config = require('config');

let db;
try {
  db = mongoose.connect(config.get('mongoURI'), {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
} catch (err) {
  console.error(err);
}

module.exports = db;
