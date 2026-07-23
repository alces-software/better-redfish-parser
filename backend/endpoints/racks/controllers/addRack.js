const Rack = require('../../../models/Rack');

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
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Server error
 */

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
module.exports = async (req, res) => {
   try {
      const { name, size, notes } = req.body || {};

      // Check name
      if (!name) {
         return res
            .status(400)
            .json({ success: false, message: 'Rack name is missing from the request' });
      }

      // Create rack
      const rack = await new Rack({ name, size, notes }).save();

      return res.status(201).json({ success: true, body: rack });
   } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
   }
};
