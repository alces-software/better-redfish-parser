import { publicProcedure } from '../../..';
import { getManufacturers } from '../../../../assets/enums/functions';

export const ManufacturersEndpoint = publicProcedure.query(() => {
   return {
      success: true,
      body: getManufacturers()
   };
});
