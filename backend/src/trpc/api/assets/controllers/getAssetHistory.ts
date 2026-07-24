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
   .query(async ({ input }) => {
      const { uuid } = input;

      // Check uuid
      if (!uuid) {
         throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Asset UUID missing from the request'
         });
      }

      // Get the latest asset version from the database
      const assets = await Asset.find({ uuid }).populate('rack').sort({ version: -1 });

      if (!assets) {
         throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No asset history found'
         });
      }

      return {
         success: true,
         body: assets
      };
   });
