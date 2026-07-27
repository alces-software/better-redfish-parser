import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../base';
import { z } from 'zod';
import { Rack } from '../../../../assets/models/Rack';
import { isValidObjectId } from 'mongoose';

export default publicProcedure
   .meta({
      openapi: {
         method: 'PUT',
         path: '/racks/',
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
            }),
         changes: z
            .object({
               name: z.string().trim().min(1, "The updated name can't be empty").optional(),
               size: z.number().min(1, "The rack size can't be less than 1").optional(),
               notes: z.string().trim().optional()
            })
            .refine((changes) => Object.keys(changes).length > 0, {
               message: 'At least one rack field must be provided'
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
   .mutation(async ({ input }) => {
      const { id, changes } = input;

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
