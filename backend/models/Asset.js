const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true
   },
   uuid: {
      type: String,
      required: true,
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
   createdAt: {
      type: Date,
      default: Date.now
   }
});

assetSchema.index({ uuid: 1, version: 1 }, { unique: true });

module.exports = mongoose.model('Asset', assetSchema);