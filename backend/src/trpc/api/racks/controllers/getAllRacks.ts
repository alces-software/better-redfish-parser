import { Rack } from '../../../../assets/models/Rack';
import { publicProcedure } from '../../../base';

export default publicProcedure.query(async () => {
   const racks = await Rack.find({});

   return {
      success: true,
      body: racks
   };
});
