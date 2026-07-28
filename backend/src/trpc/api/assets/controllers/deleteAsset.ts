import { publicProcedure } from '../../../base';
import { z } from 'zod';
import { Asset } from '../../../../assets/models/Asset';

export default publicProcedure
   .meta({
      openapi: {
         method: 'DELETE',
         path: '/assets/{uuid}',
         tags: ['assets'],
         errorResponses: {
            500: 'Internal Server Error'
         }
      }
   })
   .input(
      z.object({
         uuid: z.string().trim().min(1, 'Asset UUID missing from the request')
      })
   )
   .output(
      z.object({
         success: z.literal(true),
         body: z.number()
      })
   )
   .mutation(async ({ input }) => {
      const { uuid } = input;

      // Remove all the assets from the database with that uuid
      const result = await Asset.deleteMany({ uuid: uuid });

      return {
         success: true,
         body: result.deletedCount
      };
   });
