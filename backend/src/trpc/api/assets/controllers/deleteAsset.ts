import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../base';
import { z } from 'zod';
import { Asset } from '../../../../assets/models/Asset';

export default publicProcedure
   .input(
      z.object({
         uuid: z.string()
      })
   )
   .mutation(async ({ input }) => {
      const { uuid } = input;

      // Check the uuid
      if (!uuid) {
         throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Asset UUID missing from the request'
         });
      }

      // Remove all the assets from the database with that uuid
      const result = await Asset.deleteMany({ uuid: uuid });

      return {
         success: true,
         body: result.deletedCount
      };
   });
