const { systemTypes } = require('../../../enums/enums'),
   Asset = require('../../../models/Asset'),
   Rack = require('../../../models/Rack');

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
      const { rack, name, uuid, uPosition, systemType, notes, dataFields, rawJson } =
         req.body || {};

      const targetRack = await Rack.findById(rack);

      if (!targetRack) {
         return res.status(404).json({ success: false, message: 'Rack not found' });
      }

      const existing = await Asset.findOne({ uuid, version: 1 });

      if (existing) {
         return res.status(409).json({ success: false, message: 'Asset already exists' });
      }

      const asset = new Asset({
         name,
         uuid,
         version: 1,
         rack: targetRack._id,
         uPosition,
         systemType: Object.keys(systemTypes).find((v) => v === systemType),
         notes,
         dataFields,
         rawJson: rawJson || ''
      });

      const savedAsset = await asset.save();

      return res.status(201).json({ success: true, body: savedAsset });
   } catch (err) {
      return res.status(400).json({ success: false, message: err.message });
   }
};
