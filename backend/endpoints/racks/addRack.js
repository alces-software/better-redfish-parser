const Rack = require('../../models/Rack');

/**
 * @openapi
 * /api/racks:
 *   post:
 *     summary: Create a new rack
 *     tags:
 *       - Racks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RackInput'
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 body:
 *                   $ref: '#/components/schemas/Rack'
 *       '500':
 *         description: Server error
 */
module.exports = {
   info: {
      method: 'POST'
   },

   /**
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @returns {Promise<void>}
    */
   async call(req, res) {
      try {
         const { name, size, notes } = req.body || {};
         const rack = new Rack({ name, size, notes });
         const newRack = await rack.save();
         return res.status(201).json({ success: true, body: newRack });
      } catch (err) {
         return res.status(500).json({ success: false, message: err.message });
      }
   }
};
