import { publicProcedure } from '../../../base';
import { Asset } from '../../../../assets/models/Asset';

export default publicProcedure.query(async () => {
   const assets = await Asset.aggregate([
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

   return {
      success: true,
      body: assets
   };
});
