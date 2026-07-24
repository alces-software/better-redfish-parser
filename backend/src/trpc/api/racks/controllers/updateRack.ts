import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../base';
import { z } from 'zod';
import { Rack } from '../../../../assets/models/Rack';
import { isValidObjectId } from 'mongoose';

export default publicProcedure
   .input(
      z.object({
         id: z.string(),
         changes: z
            .object({
               name: z.string().optional(),
               size: z.number().optional(),
               notes: z.string().optional()
            })
            .refine((changes) => Object.keys(changes).length > 0, {
               message: 'At least one rack field must be provided'
            })
      })
   )
   .mutation(async ({ input }) => {
      const { id, changes } = input;

      // Validate ID
      if (!id) {
         throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Rack ID is missing from the request'
         });
      }

      if (!isValidObjectId(id)) {
         throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Rack ID is invalid'
         });
      }

      // Fetch rack
      const rack = await Rack.findByIdAndUpdate(id, changes, { returnDocument: 'after' });

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
