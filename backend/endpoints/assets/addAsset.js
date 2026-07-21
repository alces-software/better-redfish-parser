const Asset = require('../../models/Asset');
const Rack = require('../../models/Rack');
const { extractData } = require('../../services/assetServices');

module.exports = {
   info: {
      method: 'POST'
   },

   /**
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @returns {Promise<void>}
    */
   async call(req, res) {
      try {
         const { rack, name, uuid, uPosition, notes, hardwareData } = req.body || {};

         const targetRack = await Rack.findById(rack);

         if (!targetRack) {
            return res.status(404).json({ success: false, message: 'Rack not found' });
         }

         // Prevent creating a second "first version"
         const existing = await Asset.findOne({ uuid, version: 1 });

         if (existing) {
            return res.status(409).json({
               success: false,
               message: 'Asset already exists'
            });
         }

         const extractHardwareData = hardwareData ? extractData(hardwareData) : {};

         const asset = new Asset({
            name,
            uuid,
            version: 1,
            rack: targetRack._id,
            uPosition,
            notes,
            hardwareData: hardwareData || '',
            ...extractHardwareData
         });

         const savedAsset = await asset.save();

         return res.status(201).json({ success: true, body: savedAsset });
      } catch (err) {
         return res.status(400).json({ success: false, message: err.message });
      }
   }
};
