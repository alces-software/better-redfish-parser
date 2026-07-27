import { publicProcedure } from '../../../base';
import { Asset } from '../../../../assets/models/Asset';
import { z } from 'zod';

export default publicProcedure
   .meta({
      openapi: {
         method: 'GET',
         path: '/assets/',
         tags: ['assets'],
         errorResponses: {
            500: 'Internal Server Error'
         }
      }
   })
   .output(
      z.object({
         success: z.literal(true),
         body: z.array(
            z.object({
               name: z.string(),
               version: z.number(),
               uuid: z.uuid(),
               rack: z.string(),
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
   .query(async () => {
      const assets = await Asset.aggregate([
         {
            $sort: { createdAt: -1 }
         },
         {
            $group: {
               _id: '$uuid',
               doc: { $first: '$$ROOT' }
            }
         },
         {
            $replaceRoot: { newRoot: '$doc' }
         }
      ]);

      return {
         success: true,
         body: assets
      };
   });
