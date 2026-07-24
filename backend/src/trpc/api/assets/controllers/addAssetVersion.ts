import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../base';
import { z } from 'zod';
import { Asset } from '../../../../assets/models/Asset';
import { Types, isValidObjectId } from 'mongoose';
import { Rack } from '../../../../assets/models/Rack';

export default publicProcedure
   .input(
      z.object({
         uuid: z.string(),
         name: z.string(),
         rack: z.string(),
         uPosition: z.number(),
         notes: z.string().optional(),
         dataFields: z
            .array(
               z.object({
                  title: z.string(),
                  value: z.string(),
                  path: z.string().optional(),
               })
            )
            .optional(),
         rawJson: z.json()
      })
   )
   .mutation(async ({ input }) => {
      const { uuid, name, rack, uPosition, notes, dataFields, rawJson } = input;

      // Check the uuid
      if (!rack) {
         throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Asset rack ID missing from the request'
         });
      }

      if (!isValidObjectId(rack)) {
         throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Rack ID is invalid'
         });
      }

      const targetRack = await Rack.findById(rack);

      if (!targetRack) {
         throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Rack not found'
         });
      }

      // Check name
      if (!name) {
         throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Asset name is missing from the request'
         });
      }

      // Check uuid
      if (!uuid) {
         throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Asset UUID is missing from the request'
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
