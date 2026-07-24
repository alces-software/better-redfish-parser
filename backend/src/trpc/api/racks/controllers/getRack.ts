import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../base';
import { z } from 'zod';
import { Rack } from '../../../../assets/models/Rack';
import { isValidObjectId } from 'mongoose';

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

      // Fetch rack
      const rack = await Rack.findById(id);

      if (!rack) {
         throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Rack not found'
         });
      }

      return {
         success: true,
         body: rack
      };
   });
