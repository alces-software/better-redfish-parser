const mongoose = require('mongoose');

const rackSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   size: {
      type: Number,
      required: true,
      default: 1
   },
   notes: {
      type: String,
      default: ''
   }
});

module.exports = mongoose.model('Rack', rackSchema);
