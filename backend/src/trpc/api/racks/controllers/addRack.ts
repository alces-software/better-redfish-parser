import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../base';
import { z } from 'zod';
import { Rack } from '../../../../assets/models/Rack';

export default publicProcedure
   .input(
      z.object({
         name: z.string(),
         size: z.number(),
         notes: z.string()
      })
   )
   .mutation(async ({ input }) => {
      const { name, size, notes } = input;

      // Check name
      if (!name) {
         throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Rack name is missing from the request'
         });
      }

      // Create rack
      const rack = await new Rack({ name, size, notes }).save();

      return {
         success: true,
         body: rack
      };
   });
