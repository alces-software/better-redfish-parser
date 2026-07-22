const mongoose = require('mongoose');

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
 *         notes:
 *           type: string
 *         hardwareData:
 *           type: object
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
 *         notes:
 *           type: string
 *         imported_json:
 *           type: string
 *         cores:
 *           type: string
 *         processor_name:
 *           type: string
 *         processor_count:
 *           type: string
 *         memory:
 *           type: string
 *         model:
 *           type: string
 *         serial_number:
 *           type: string
 *         manufacturer:
 *           type: string
 *         led:
 *           type: string
 *         description:
 *           type: string
 *       required:
 *         - name
 *         - uuid
 *         - version
 *         - rack
 *         - uPosition
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
            name: { type: String, default: 'Not found' },
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
   }
});

assetSchema.index({ uuid: 1, version: 1 }, { unique: true });

module.exports = mongoose.model('Asset', assetSchema);
