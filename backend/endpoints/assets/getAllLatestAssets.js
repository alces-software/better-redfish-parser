const Asset = require('../../models/Asset');

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
module.exports = {
   info: {
      method: 'GET'
   },

   /**
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @returns {Promise<void>}
    */
   async call(req, res) {
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
      } catch (err) {
         return res.status(500).json({ success: false, message: err.message });
      }
   }
};
