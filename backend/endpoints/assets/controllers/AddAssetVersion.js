const Asset = require('../../../models/Asset'),
   { extractData } = require('../../../services/assetServices');

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
      const { name, rack, uPosition, notes, dataFields, rawJson } = req.body || {};

      if (!uuid) {
         return res
            .status(400)
            .json({ success: false, message: 'Asset UUID missing from request' });
      }

      const current = await Asset.findOne({ uuid }).sort({ version: -1 });

      if (!current) {
         return res.status(404).json({ success: false, message: 'Asset not found' });
      }

      // const extractHardwareData = hardwareData ? extractData(hardwareData) : {};

      const newVersion = new Asset({
         uuid: current.uuid,
         version: current.version + 1,
         name: name ?? current.name,
         rack: rack ?? current.rack,
         uPosition: uPosition ?? current.uPosition,
         notes: notes ?? current.notes,
         dataFields: dataFields ?? current.dataFields,
         rawJson: rawJson ?? current.rawJson
         // fans: extractHardwareData.fans ?? current.fans,
         // ethernetInterfaces: extractHardwareData.ethernetInterfaces ?? current.ethernetInterfaces,
         // bootOptions: extractHardwareData.bootOptions ?? current.bootOptions
      });

      await newVersion.save();

      return res.status(201).json({ success: true, body: newVersion });
   } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
   }
};
