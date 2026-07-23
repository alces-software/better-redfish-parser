const Asset = require('../../../models/Asset');

/**
 * @openapi
 * /api/assets/{uuid}:
 *   delete:
 *     summary: Delete all versions of an asset by UUID
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
 *         description: Deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 deleted:
 *                   type: integer
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
      const { uuid } = req.params || {};

      // Check the uuid
      if (!uuid) {
         return res
            .status(400)
            .json({ success: false, message: 'Asset UUID is missing from the request' });
      }

      // Remove all the assets from the database with that uuid
      const result = await Asset.deleteMany({ uuid: uuid });

      return res.json({ success: true, deleted: result.deletedCount });
   } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
   }
};
