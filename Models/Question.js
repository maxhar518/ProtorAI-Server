const mongoose = require('mongoose');

const optionSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    required: true
  }
});

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: {
    type: [optionSchema],
    validate: {
      validator: function (opts) {
        // Must be at least 4 options
        if (opts.length < 4) return false;

        // Only one correct answer
        const correctCount = opts.filter(opt => opt.isCorrect).length;
        return correctCount === 1;
      },
      message: 'There must be at least 4 options and exactly one correct answer.'
    }
  }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;