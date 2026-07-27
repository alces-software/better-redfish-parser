import { z } from 'zod';
import { publicProcedure } from '../../../base';
import { Manufacturers } from '../../../../assets/enums/enums';

export default publicProcedure
   .meta({
      openapi: {
         method: 'GET',
         path: '/enums/manufacturers',
         tags: ['enums'],
         errorResponses: {
            500: 'Internal server error'
         }
      }
   })
   .output(
      z.object({
         success: z.literal(true),
         body: z.array(
            z.object({
               name: z.string(),
               value: z.number()
            })
         )
      })
   )
   .query(async () => {
      return {
         success: true,
         body: Object.entries(Manufacturers).map(([name, value]) => ({
            name,
            value
         }))
      };
   });
