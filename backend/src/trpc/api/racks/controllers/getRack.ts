import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../base';
import { z } from 'zod';
import { Rack } from '../../../../assets/models/Rack';
import { isValidObjectId } from 'mongoose';

export default publicProcedure
   .input(
      z.object({
         id: z
            .string()
            .trim()
            .min(1, 'Rack ID is missing from the request')
            .refine(isValidObjectId, {
               message: 'Rack ID is invalid'
            })
      })
   )
   .query(async ({ input }) => {
      const { id } = input;

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
