import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../base';
import { z } from 'zod';
import { Asset } from '../../../../assets/models/Asset';

export default publicProcedure
   .input(
      z.object({
         uuid: z.uuid().trim().min(1, 'Asset UUID missing from the request')
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
