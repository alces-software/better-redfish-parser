import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../base';
import { z } from 'zod';
import { Rack } from '../../../../assets/models/Rack';
import { isValidObjectId } from 'mongoose';

export default publicProcedure
   .meta({
      openapi: {
         method: 'GET',
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
         body: z.object({
            id: z.string(),
            name: z.string(),
            size: z.number(),
            notes: z.string()
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
