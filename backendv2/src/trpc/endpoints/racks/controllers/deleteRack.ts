import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../base';
import { z } from 'zod';
import { Rack } from '../../../../assets/models/Rack';
import { isValidObjectId } from 'mongoose';
import { Asset } from '../../../../assets/models/Asset';

export default publicProcedure
   .input(
      z.object({
         id: z.string()
      })
   )
   .query(async ({ input }) => {
      const { id } = input;

      // Validate ID
      if (!isValidObjectId(id)) {
         throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Rack ID is invalid'
         });
      }

      // Find and delete the rack
      const rack = await Rack.findByIdAndDelete(id);

      if (!rack) {
         throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Rack not found'
         });
      }

      // Delete all assets associated with the rack
      await Asset.deleteMany({ rack: rack._id });

      return {
         success: true,
         message: 'Rack deleted'
      };
   });
