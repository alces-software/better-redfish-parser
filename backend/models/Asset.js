const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   uuid: {
      type: String,
      required: true
   },
   version: {
      type: Number,
      required: true,
      default: 1
   },
   rack: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rack',
      required: true
   },
   uPosition: {
      type: Number,
      required: true
   },
   notes: {
      type: String,
      default: ''
   },
   imported_json: {
      type: String,
      default: ''
   },

   // Extracted hardware data
   cores: {
      type: mongoose.Schema.Types.Mixed,
      default: 'Not found'
   },
   processor_name: {
      type: String,
      default: 'Not found'
   },
   processor_count: {
      type: mongoose.Schema.Types.Mixed,
      default: 'Not found'
   },
   memory: {
      type: String,
      default: 'Not Found'
   },
   model: {
      type: String,
      default: 'Not Found'
   },
   serial_number: {
      type: String,
      default: 'Not Found'
   },
   manufacturer: {
      type: String,
      default: 'Not Found'
   },
   led: {
      type: String,
      default: 'Not Found'
   },
   description: {
      type: String,
      default: 'Not Found'
   }
});

assetSchema.index({ uuid: 1, version: 1 }, { unique: true });

module.exports = mongoose.model('Asset', assetSchema);
