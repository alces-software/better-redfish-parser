const Asset = require('../../../models/Asset'),
   Rack = require('../../../models/Rack'),
   { isValidObjectId } = require('mongoose');

/**
 * @openapi
 * /api/assets/{uuid}:
 *   post:
 *     summary: Create a new version for an existing asset
 *     tags:
 *       - Assets
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
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
      const { uuid } = req.params || {};
      const { name, rack, uPosition, notes, dataFields, rawJson } = req.body || {};

      // Check uuid
      if (!uuid) {
         return res
            .status(400)
            .json({ success: false, message: 'Asset UUID is missing from the request' });
      }

      // Check name
      if (!name) {
         return res
            .status(400)
            .json({ success: false, message: 'Asset name is missing from the request' });
      }

      // Check rack
      if (!rack) {
         return res
            .json(400)
            .json({ success: false, message: 'Asset rack ID is missing from the request' });
      }

      if (!isValidObjectId(rack)) {
         return res.status(400).json({ success: false, message: 'Rack ID is invalid' });
      }

      const newRack = await Rack.findById(rack);

      if (!newRack) {
         return res.status(404).json({ success: false, message: 'Rack not found' });
      }

      // Check for current version
      const currentAsset = await Asset.findOne({ uuid }).sort({ version: -1 });

      if (!currentAsset) {
         return res.status(404).json({ success: false, message: 'Asset not found' });
      }

      const newVersion = new Asset({
         uuid: currentAsset.uuid,
         version: currentAsset.version + 1,
         name: name ?? currentAsset.name,
         rack: rack ?? currentAsset.rack,
         uPosition: uPosition ?? currentAsset.uPosition,
         notes: notes ?? currentAsset.notes,
         dataFields: dataFields ?? currentAsset.dataFields,
         rawJson: rawJson ?? currentAsset.rawJson,
         systemType: currentAsset.systemType
      });

      await newVersion.save();

      return res.status(201).json({ success: true, body: newVersion });
   } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
   }
};
