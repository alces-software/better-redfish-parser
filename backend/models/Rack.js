const mongoose = require('mongoose');

/**
 * @openapi
 * components:
 *   schemas:
 *     RackInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         size:
 *           type: integer
 *         notes:
 *           type: string
 *       required:
 *         - name
 *     Rack:
 *       allOf:
 *         - $ref: '#/components/schemas/RackInput'
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 */

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
