const Asset = require('../../../models/Asset');

/**
 * @openapi
 * /api/assets/{uuid}:
 *   get:
 *     summary: Get the latest version of an asset by UUID
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
 *                   $ref: '#/components/schemas/Asset'
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

      if (!uuid) {
         return res
            .status(400)
            .json({ success: false, message: 'Asset UUID missing from request' });
      }

      const asset = await Asset.findOne({ uuid }).sort({ version: -1 }).populate('rack');

      if (!asset) {
         return res.status(404).json({ success: false, message: 'Asset not found' });
      }

      return res.status(200).json({ success: true, body: asset });
   } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
   }
};
