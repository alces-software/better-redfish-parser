import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../base';
import { z } from 'zod';
import { Rack } from '../../../../assets/models/Rack';
import { isValidObjectId } from 'mongoose';
import { Asset } from '../../../../assets/models/Asset';

export default publicProcedure
   .meta({
      openapi: {
         method: 'DELETE',
         path: '/racks/{id}',
         tags: ['racks'],
         errorResponses: {
            404: 'Not Found',
            500: 'Internal Server Error'
         }
      }
   })
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
   .output(
      z.object({
         success: z.literal(true),
         message: z.literal('Rack deleted')
      })
   )
   .mutation(async ({ input }) => {
      const { id } = input;

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
