import { getManufacturers } from '../../../assets/enums/functions';

/**
 * @openapi
 * /api/enums/system:
 *   get:
 *     summary: Get available system types
 *     tags:
 *       - Enums
 *     responses:
 *       '200':
 *         description: List of available system types with their values
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
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       value:
 *                         type: number
 *       '500':
 *         description: Server error
 */

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<void>}
 */
export default async (req: import('express').Request, res: import('express').Response) => {
   try {
      return res.status(200).json({
         success: true,
         body: getManufacturers()
      });
   } catch (error) {
      return res
         .status(500)
         .json({ success: false, message: error instanceof Error ? error.message : String(error) });
   }
};
