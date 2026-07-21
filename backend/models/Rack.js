const mongoose = require('mongoose');

const rackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  notes: {
    type: String,
  }
});

module.exports = mongoose.model('Rack', rackSchema);