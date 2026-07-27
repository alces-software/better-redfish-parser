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
   .query(async ({ input }) => {
      const { uuid } = input;

      // Get the latest asset version from the database
      const asset = await Asset.findOne({ uuid }).sort({ version: -1 }).populate('rack');

      if (!asset) {
         throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Asset not found'
         });
      }

      return {
         success: true,
         body: asset
      };
   });
