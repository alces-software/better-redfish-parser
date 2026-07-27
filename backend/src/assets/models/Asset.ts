import mongoose from 'mongoose';
import { Manufacturers } from '../enums/enums';

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
   manufacturer: {
      type: String,
      enum: Object.keys(Manufacturers),
      required: true
   },
   notes: {
      type: String,
      default: ''
   },
   dataFields: {
      type: [
         {
            title: { type: String, default: 'Unset' },
            value: { type: String, default: 'Unset' },
            path: { type: String, default: 'Unset' }
         }
      ],
      default: []
   },
   rawJson: {
      type: String,
      default: ''
   }
});

assetSchema.index({ uuid: 1, version: 1 }, { unique: true });

export const Asset = mongoose.model('Asset', assetSchema);
