/**
 * @openapi
 * /api/assets:
 *   get:
 *     summary: Get latest version of all assets
 *     tags:
 *       - Assets
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
 *                     $ref: '#/components/schemas/Asset'
 *       '500':
 *         description: Server error
 */

import { Asset } from '../../../assets/models/Asset';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
export default async (req: import('express').Request, res: import('express').Response) => {
   try {
      const latestAssets = await Asset.aggregate([
         {
            $sort: { createdAt: -1 }
         },
         {
            $group: {
               _id: '$uuid',
               doc: { $first: '$$ROOT' }
            }
         },
         {
            $replaceRoot: { newRoot: '$doc' }
         }
      ]);

      return res.status(200).json({ success: true, body: latestAssets });
   } catch (error) {
      return res
         .status(500)
         .json({ success: false, message: error instanceof Error ? error.message : String(error) });
   }
};
