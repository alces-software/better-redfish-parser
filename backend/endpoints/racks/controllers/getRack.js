const Rack = require('../../../models/Rack');

/**
 * @openapi
 * /api/racks/{id}:
 *   get:
 *     summary: Get a rack by ID
 *     tags:
 *       - Racks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *                   $ref: '#/components/schemas/Rack'
 *       '404':
 *         description: Not found
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
      const { id } = req.params || {};

      if (!id) {
         return res.status(400).json({ success: false, message: 'Rack ID missing from request' });
      }

      const rack = await Rack.findById(id);

      if (!rack) {
         return res.status(404).json({ success: false, message: 'Rack not found' });
      }

      return res.status(200).json({ success: true, body: rack });
   } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
   }
};
