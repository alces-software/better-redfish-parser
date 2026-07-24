/**
 * @openapi
 * /api/racks:
 *   get:
 *     summary: List all racks
 *     tags:
 *       - Racks
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
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Rack'
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
      const racks = await Rack.find();

      return res.status(200).json({ success: true, body: racks });
   } catch (error) {
      return res
         .status(500)
         .json({ success: false, message: error instanceof Error ? error.message : String(error) });
   }
};
