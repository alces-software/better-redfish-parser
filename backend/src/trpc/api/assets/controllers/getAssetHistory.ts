import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../base';
import { z } from 'zod';
import { Asset } from '../../../../assets/models/Asset';

export default publicProcedure
   .meta({
      openapi: {
         method: 'GET',
         path: '/assets/{uuid}/history',
         tags: ['assets'],
         errorResponses: {
            404: 'Not Found',
            500: 'Internal Server Error'
         }
      }
   })
   .input(
      z.object({
         uuid: z.uuid().trim().min(1, 'Asset UUID missing from the request')
      })
   )
   .output(
      z.object({
         success: z.literal(true),
         body: z.array(
            z.object({
               name: z.string(),
               version: z.number(),
               uuid: z.uuid(),
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
         )
      })
   )
   .query(async ({ input }) => {
      const { uuid } = input;

      // Get the latest asset version from the database
      const assets = await Asset.find({ uuid }).populate('rack').sort({ version: -1 });

      if (!assets) {
         throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'No asset history found'
         });
      }

      return {
         success: true,
         body: assets
      };
   });
