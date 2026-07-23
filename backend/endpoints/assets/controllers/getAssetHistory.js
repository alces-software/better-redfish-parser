const Asset = require('../../../models/Asset');

/**
 * @openapi
 * /api/assets/{uuid}/history:
 *   get:
 *     summary: Get version history for an asset
 *     tags:
 *       - Assets
 *     parameters:
 *       - in: path
 *         name: uuid
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Asset'
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Asset not found
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
      const { uuid } = req.params || {};

      // Check uuid
      if (!uuid) {
         return res
            .status(400)
            .json({ success: false, message: 'Asset UUID is missing from the request' });
      }

      // Get all the assets from the database with that uuid that aren't the current version
      const assets = await Asset.find({ uuid }).populate('rack').sort({ version: -1 });

      if (!assets.length) {
         return res.status(404).json({ success: false, message: 'N asset history found' });
      }

      return res.status(200).json({ success: true, body: assets });
   } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
   }
};
