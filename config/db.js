const mongoose = require('mongoose');
const config = require('config');

const mongoURI = process.env.MONGO_URI || config.get('mongoURI');

console.log(process.env);
console.log(mongoURI);

let db;
try {
  db = mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
} catch (err) {
  console.error(err);
}

module.exports = db;
