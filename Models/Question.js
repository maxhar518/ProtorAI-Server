const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    trim: true
  },
  options: {
    type: Array,
    length: 4
  },
  answer: {
    type: String
  }
});

module.exports = mongoose.model('question', questionSchema)