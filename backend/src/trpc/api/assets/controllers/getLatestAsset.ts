import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../base';
import { z } from 'zod';
import { Asset } from '../../../../assets/models/Asset';

export default publicProcedure
   .meta({
      openapi: {
         method: 'GET',
         path: '/assets/{uuid}',
         tags: ['assets'],
         errorResponses: {
            404: 'Not Found',
            500: 'Internal Server Error'
         }
      }
   })
   .input(
      z.object({
         uuid: z.string().trim().min(1, 'Asset UUID missing from the request')
      })
   )
   .output(
      z.object({
         success: z.literal(true),
         body: z.object({
            name: z.string(),
            version: z.number(),
            uuid: z.string(),
            rack: z.any(),
            uPosition: z.number(),
            notes: z.string(),
            dataFields: z.array(
               z.object({
                  title: z.string(),
                  value: z.string(),
                  path: z.string()
               })
            ),
            rawJson: z.json()
         })
      })
   )
   .query(async ({ input }) => {
      const { uuid } = input;

      // Get the latest asset version from the database
      const asset = await Asset.findOne({ uuid }).sort({ version: -1 }).populate('rack');

      if (!asset) {
         throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Asset not found'
         });
      }

      return {
         success: true,
         body: asset
      };
   });
