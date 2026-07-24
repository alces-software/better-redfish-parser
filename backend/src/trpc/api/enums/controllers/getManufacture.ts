import { publicProcedure } from '../../../base';
import { getManufacturers } from '../../../../assets/enums/functions';

export default publicProcedure.query(async () => {
   return {
      success: true,
      body: getManufacturers()
   };
});
