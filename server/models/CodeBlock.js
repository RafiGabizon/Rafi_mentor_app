const mongoose = require('mongoose');

// Define the schema for the CodeBlock model
const CodeBlockSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  initialCode: {
    type: String,
    required: true
  },
  solution: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CodeBlock', CodeBlockSchema);