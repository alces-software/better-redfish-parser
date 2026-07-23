const Rack = require('../../../models/Rack'),
   Asset = require('../../../models/Asset'),
   { isValidObjectId } = require('mongoose');

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
 *       '400':
 *         description: Bad request
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

      // Check id
      if (!id) {
         return res
            .status(400)
            .json({ success: false, message: 'Rack ID is missing from the request' });
      }

      if (!isValidObjectId(id)) {
         return res.status(400).json({ success: false, message: 'Rack ID is invalid' });
      }

      // Find and delete the rack
      const rack = await Rack.findByIdAndDelete(id);

      if (!rack) {
         return res.status(404).json({ success: false, message: 'Rack not found' });
      }

      // Delete all assets associated with the rack
      await Asset.deleteMany({ rack: rack._id });

      return res.status(200).json({ success: true, message: 'Rack deleted' });
   } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
   }
};
