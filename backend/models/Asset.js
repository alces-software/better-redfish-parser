const mongoose = require('mongoose'),
   { systemTypes } = require('../enums/enums');

/**
 * @openapi
 * components:
 *   schemas:
 *     AssetInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         uuid:
 *           type: string
 *         rack:
 *           type: string
 *         uPosition:
 *           type: integer
 *         systemType:
 *           type: string
 *         notes:
 *           type: string
 *         dataFields:
 *           type: object
 *         rawJson:
 *           type: string
 *     Asset:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         uuid:
 *           type: string
 *         version:
 *           type: integer
 *         rack:
 *           $ref: '#/components/schemas/Rack'
 *         uPosition:
 *           type: integer
 *         systemType:
 *           type: string
 *         notes:
 *           type: string
 *         dataFields:
 *           type: object
 *         fans:
 *           type: object
 *         ethernetInterfaces:
 *           type: object
 *         bootOptions:
 *           type: object
 *         rawJson:
 *           type: string
 *       required:
 *         - name
 *         - uuid
 *         - version
 *         - rack
 *         - uPosition
 *         - systemType
 */

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
   systemType: {
      type: String,
      enum: Object.keys(systemTypes),
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
   fans: {
      type: [
         {
            name: { type: String, default: 'Not found' },
            health: { type: String, default: 'Not found' },
            speed: { type: String, default: 'Not found' },
            units: { type: String, default: 'Not found' },
            state: { type: String, default: 'Not found' },
            hotPluggable: { type: String, default: 'Not found' }
         }
      ],
      default: []
   },
   ethernetInterfaces: {
      type: [
         {
            id: { type: String, default: 'Not found' },
            description: { type: String, default: 'Not found' },
            macAddress: { type: String, default: 'Not found' },
            permanentMacAddress: { type: String, default: 'Not found' },
            speedMbps: { type: String, default: 'Not found' },
            state: { type: String, default: 'Not found' },
            health: { type: String, default: 'Not found' },
            linkStatus: { type: String, default: 'Not found' },
            enabled: { type: String, default: 'Not found' }
         }
      ],
      default: []
   },
   bootOptions: {
      type: [
         {
            id: { type: String, default: 'Not found' },
            displayName: { type: String, default: 'Not found' },
            position: { type: String, default: 'Not found' },
            enabled: { type: String, default: 'Not found' },
            devicePath: { type: String, default: 'Not found' }
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

module.exports = mongoose.model('Asset', assetSchema);
