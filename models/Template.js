const mongoose = require('mongoose');

const TemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  content: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

module.exports = Template = new mongoose.model('template', TemplateSchema);
