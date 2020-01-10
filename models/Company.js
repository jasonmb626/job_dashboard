const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Company = new mongoose.model('company', CompanySchema);
