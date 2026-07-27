import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../base';
import { z } from 'zod';
import { Rack } from '../../../../assets/models/Rack';

export default publicProcedure
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
