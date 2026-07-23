const Asset = require('../../../models/Asset'),
   Rack = require('../../../models/Rack'),
   { extractData } = require('../../../services/assetServices');

/**
 * @openapi
 * /api/assets:
 *   post:
 *     summary: Create a new asset (initial version)
 *     tags:
 *       - Assets
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssetInput'
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
 *                   $ref: '#/components/schemas/Asset'
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Rack not found
 *       '409':
 *         description: Asset already exists
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
      const { rack, name, uuid, uPosition, notes, hardwareData } = req.body || {};

      const targetRack = await Rack.findById(rack);

      if (!targetRack) {
         return res.status(404).json({ success: false, message: 'Rack not found' });
      }

      const existing = await Asset.findOne({ uuid, version: 1 });

      if (existing) {
         return res.status(409).json({ success: false, message: 'Asset already exists' });
      }

      const extractHardwareData = hardwareData ? extractData(hardwareData) : {};

      const asset = new Asset({
         name,
         uuid,
         version: 1,
         rack: targetRack._id,
         uPosition,
         notes,
         imported_json: hardwareData || '',
         ...extractHardwareData
      });

      const savedAsset = await asset.save();

      return res.status(201).json({ success: true, body: savedAsset });
   } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
   }
};
