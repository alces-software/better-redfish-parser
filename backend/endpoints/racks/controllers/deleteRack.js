const Rack = require('../../../models/Rack'),
   Asset = require('../../../models/Asset');

/**
 * @openapi
 * /api/racks/{id}:
 *   delete:
 *     summary: Delete a rack and its assets
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
 *         description: Deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
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

      const deletedRack = await Rack.findByIdAndDelete(id);

      if (!deletedRack) {
         return res.status(404).json({ success: false, message: 'Rack not found' });
      }

      const assets = await Asset.find({ rack: deletedRack._id });
      const uuids = assets.map((asset) => asset.uuid);

      await Asset.deleteMany({ uuid: { $in: uuids } });

      return res.status(200).json({ success: true, message: 'Rack deleted' });
   } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
   }
};
