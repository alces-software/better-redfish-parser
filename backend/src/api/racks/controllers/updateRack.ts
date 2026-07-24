/**
 * @openapi
 * /api/racks/{id}:
 *   put:
 *     summary: Update a rack by ID
 *     tags:
 *       - Racks
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RackInput'
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
      const body = req.body || {};

      // Check id
      if (!id) {
         return res
            .status(400)
            .json({ success: false, message: 'Rack ID is missing from the request' });
      }

      if (!isValidObjectId(id)) {
         return res.status(400).json({ success: false, message: 'Rack ID is invalid' });
      }

      // Update the database
      const updatedRack = await Rack.findByIdAndUpdate(id, body, { new: true });

      if (!updatedRack) {
         return res.status(404).json({ success: false, message: 'Rack not found' });
      }

      return res.status(200).json({ success: true, body: updatedRack });
   } catch (error) {
      return res
         .status(500)
         .json({ success: false, message: error instanceof Error ? error.message : String(error) });
   }
};
