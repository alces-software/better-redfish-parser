import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../base';
import { z } from 'zod';
import { Asset } from '../../../../assets/models/Asset';
import { Types, isValidObjectId } from 'mongoose';
import { Rack } from '../../../../assets/models/Rack';

export default publicProcedure
   .input(
      z.object({
         uuid: z.uuid().trim().min(1, 'Asset UUID is missing from the request'),
         name: z.string().trim().min(1, 'Asset name is missing from the request'),
         rack: z
            .string()
            .trim()
            .min(1, 'Asset rack ID missing from the request')
            .refine(isValidObjectId, {
               message: 'Rack ID is invalid'
            }),
         uPosition: z.number().min(1, "The U-Position can't be less than 1"),
         notes: z.string().trim().optional(),
         dataFields: z
            .array(
               z.object({
                  title: z.string().trim().min(1, "The title of a datafield can't be empty"),
                  value: z.string().trim(),
                  path: z.string().trim().optional()
               })
            )
            .optional(),
         rawJson: z.json()
      })
   )
   .mutation(async ({ input }) => {
      const { uuid, name, rack, uPosition, notes, dataFields, rawJson } = input;

      // Check if rack exists
      const targetRack = await Rack.findById(rack);

      if (!targetRack) {
         throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Rack not found'
         });
      }

      // Check for current version
      const currentAsset = await Asset.findOne({ uuid }).sort({ version: -1 });

      if (!currentAsset) {
         throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Asset not found'
         });
      }

      const newAsset = await new Asset({
         uuid: currentAsset.uuid,
         version: currentAsset.version + 1,
         name: name ?? currentAsset.name,
         rack: targetRack._id ?? currentAsset.rack,
         uPosition: uPosition ?? currentAsset.uPosition,
         notes: notes ?? currentAsset.notes,
         dataFields: dataFields ?? currentAsset.dataFields,
         rawJson: rawJson ?? currentAsset.rawJson,
         manufacturer: currentAsset.manufacturer
      }).save();

      return {
         success: true,
         body: newAsset
      };
   });
