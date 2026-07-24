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

import { Manufacturers } from '../../../assets/enums/enums';
import { Asset } from '../../../assets/models/Asset';
import { Rack } from '../../../assets/models/Rack';
import { isValidObjectId } from 'mongoose';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
export default async (req: import('express').Request, res: import('express').Response) => {
   try {
      const { rack, name, uuid, uPosition, manufacturer, notes, dataFields, rawJson } =
         req.body || {};

      // Check rack
      if (!rack) {
         return res
            .json(400)
            .json({ success: false, message: 'Asset rack ID is missing from the request' });
      }

      if (!isValidObjectId(rack)) {
         return res.status(400).json({ success: false, message: 'Rack ID is invalid' });
      }

      const targetRack = await Rack.findById(rack);

      if (!targetRack) {
         return res.status(404).json({ success: false, message: 'Rack not found' });
      }

      // Check name
      if (!name) {
         return res
            .status(400)
            .json({ success: false, message: 'Asset name is missing from the request' });
      }

      // Check uuid
      if (!uuid) {
         return res
            .status(400)
            .json({ success: false, message: 'Asset UUID is missing from the request' });
      }

      // Check manufacture
      if (!manufacturer) {
         return res
            .status(400)
            .json({ success: false, message: 'Asset manufacture is missing from the request' });
      }

      const manufactureName = Object.keys(Manufacturers).find(
         (key) => Manufacturers[key as keyof typeof Manufacturers] === manufacturer
      );

      if (!manufactureName) {
         return res
            .status(400)
            .json({ success: false, message: 'Asset manufacture is not recognised' });
      }

      // Check if asset exists already
      const existing = await Asset.findOne({ uuid, version: 1 });

      if (existing) {
         return res.status(409).json({ success: false, message: 'Asset already exists' });
      }

      const asset = await new Asset({
         name,
         uuid,
         version: 1,
         rack: targetRack._id,
         uPosition,
         manufacturer: manufactureName || 'HP',
         notes,
         dataFields,
         rawJson: JSON.stringify(rawJson, null, 2) || ''
      }).save();

      return res.status(201).json({ success: true, body: asset });
   } catch (error) {
      return res
         .status(500)
         .json({ success: false, message: error instanceof Error ? error.message : String(error) });
   }
};
