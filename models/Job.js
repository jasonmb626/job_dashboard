const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'company',
    required: true
  },
  where_listed: {
    type: String
  },
  cover_letter: {
    type: String
  },
  finished_applying: {
    type: Boolean,
    default: false
  },
  follow_up: {
    type: Date
  },
  hiring_managers: {
    type: Array
  },
  still_open: {
    type: Boolean,
    default: true
  },
  actions: {
    type: Array
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Job = new mongoose.model('job', JobSchema);
