const Rack = require('../../models/Rack');

/**
 * @openapi
 * /api/racks:
 *   get:
 *     summary: List all racks
 *     tags:
 *       - Racks
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 body:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Rack'
 *       '500':
 *         description: Server error
 */
module.exports = {
   info: {
      method: 'GET'
   },

   /**
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @returns {Promise<void>}
    */
   async call(req, res) {
      try {
         const racks = await Rack.find();

         return res.status(200).json({ success: true, body: racks });
      } catch (err) {
         return res.status(500).json({ success: false, message: err.message });
      }
   }
};
