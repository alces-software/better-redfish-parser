import { z } from 'zod';
import { Rack } from '../../../../assets/models/Rack';
import { publicProcedure } from '../../../base';

export default publicProcedure
   .meta({
      openapi: {
         method: 'PUT',
         path: '/racks/',
         tags: ['racks'],
         errorResponses: {
            500: 'Internal Server Error'
         }
      }
   })
   .output(
      z.object({
         success: z.literal(true),
         body: z.array(
            z.object({
               id: z.string(),
               name: z.string(),
               size: z.number(),
               notes: z.string()
            })
         )
      })
   )
   .query(async () => {
      const racks = await Rack.find({});

      return {
         success: true,
         body: racks
      };
   });
