import { TRPCError } from '@trpc/server';
import { publicProcedure } from '../../../base';
import { z } from 'zod';
import { Asset } from '../../../../assets/models/Asset';
import { isValidObjectId } from 'mongoose';
import { Manufacturers } from '../../../../assets/enums/enums';
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
         uPosition: z.number().min(0, "The U-Position can't be less than 1"),
         manufacturer: z.number().min(1, "The manufacture enum can't be less than 1 "),
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
      const { uuid, name, rack, uPosition, manufacturer, notes, dataFields, rawJson } = input;

      // Check the rack exists
      const targetRack = await Rack.findById(rack);

      if (!targetRack) {
         throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Rack not found'
         });
      }

      // Get manufacture name
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
         manufacturer: manufactureName || 'Unknown',
         notes,
         dataFields,
         rawJson: JSON.stringify(rawJson, null, 2) || ''
      }).save();

      return {
         success: true,
         body: asset
      };
   });
