/**
 * @openapi
 * /api/racks:
 *   post:
 *     summary: Create a new rack
 *     tags:
 *       - Racks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RackInput'
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
 *                   $ref: '#/components/schemas/Rack'
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Server error
 */

import { Rack } from '../../../assets/models/Rack';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
export default async (req: import('express').Request, res: import('express').Response) => {
   try {
      const { name, size, notes } = req.body || {};

      // Check name
      if (!name) {
         return res
            .status(400)
            .json({ success: false, message: 'Rack name is missing from the request' });
      }

      // Create rack
      const rack = await new Rack({ name, size, notes }).save();

      return res.status(201).json({ success: true, body: rack });
   } catch (error) {
      return res
         .status(500)
         .json({ success: false, message: error instanceof Error ? error.message : String(error) });
   }
};
