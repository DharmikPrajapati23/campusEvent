const mongoose = require('mongoose');

const Query = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  mail: {
    type: String,
    required: true
  },

  message: {
    type: String,
    required: true
  }
}, { collection: 'query' });

module.exports = mongoose.model('query', Query);
