import { publicProcedure } from '../../../base';
import { z } from 'zod';
import { Rack } from '../../../../assets/models/Rack';

export default publicProcedure
   .meta({
      openapi: {
         method: 'POST',
         path: '/racks/',
         tags: ['racks'],
         errorResponses: {
            404: 'Not Found',
            500: 'Internal Server Error'
         }
      }
   })
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
   .input(
      z.object({
         name: z.string().trim().min(1, "Rack name can't be empty"),
         size: z.number().min(1, "Rack size can't be less than 1"),
         notes: z.string().trim().optional()
      })
   )
   .mutation(async ({ input }) => {
      const { name, size, notes } = input;

      // Create rack
      const rack = await new Rack({ name, size, notes }).save();

      return {
         success: true,
         body: rack
      };
   });
