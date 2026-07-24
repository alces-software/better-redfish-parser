import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../base';
import { z } from 'zod';
import { Asset } from '../../../../assets/models/Asset';
import { Types, isValidObjectId } from 'mongoose';
import { Manufacturers } from '../../../../assets/enums/enums';
import { Rack } from '../../../../assets/models/Rack';

export default publicProcedure
   .input(
      z.object({
         uuid: z.string(),
         name: z.string(),
         rack: Types.ObjectId,
         uPosition: z.number(),
         manufacturer: Manufacturers,
         notes: z.string().optional(),
         dataFields: z
            .object({
               title: z.string(),
               value: z.string(),
               path: z.string()
            })
            .optional(),
         rawJson: z.json()
      })
   )
   .mutation(async ({ input }) => {
      const { uuid, name, rack, uPosition, manufacturer, notes, dataFields, rawJson } = input;

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

      // Check manufacture
      if (!manufacturer) {
         throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Asset manufacture is missing from the request'
         });
      }

      const manufactureName = Object.keys(Manufacturers).find(
         (key) => Manufacturers[key as keyof typeof Manufacturers] === manufacturer
      );

      if (!manufactureName) {
         throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Asset manufacture is not recognised'
         });
      }

      // Check if asset exists already
      const existing = await Asset.findOne({ uuid, version: 1 });

      if (existing) {
         throw new TRPCError({
            code: 'CONFLICT',
            message: 'Asset already exists'
         });
      }

      const asset = await new Asset({
         name,
         uuid,
         version: 1,
         rack: targetRack._id,
         uPosition,
         manufacturer: manufactureName || 'HP',
         notes,
         dataFields,
         rawJson: JSON.stringify(rawJson, null, 2) || ''
      }).save();

      return {
         success: true,
         body: asset
      };
   });
