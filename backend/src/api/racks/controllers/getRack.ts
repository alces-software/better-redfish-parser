/**
 * @openapi
 * /api/racks/{id}:
 *   get:
 *     summary: Get a rack by ID
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
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 body:
 *                   $ref: '#/components/schemas/Rack'
 *       '400':
 *         description: Bad request
 *       '404':
 *         description: Not found
 *       '500':
 *         description: Server error
 */

import { Rack } from '../../../assets/models/Rack';
import { isValidObjectId } from 'mongoose';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
export default async (req: import('express').Request, res: import('express').Response) => {
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

      // Get the rack
      const rack = await Rack.findById(id);

      if (!rack) {
         return res.status(404).json({ success: false, message: 'Rack not found' });
      }

      return res.status(200).json({ success: true, body: rack });
   } catch (error) {
      return res
         .status(500)
         .json({ success: false, message: error instanceof Error ? error.message : String(error) });
   }
};
