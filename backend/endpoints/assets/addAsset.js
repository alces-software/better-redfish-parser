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
         const rack = await Rack.findById(req.body.rack);

         if (!rack) {
            return res.status(404).json({
               success: false,
               message: 'Rack not found'
            });
         }

         // Prevent creating a second "first version"
         const existing = await Asset.findOne({
            uuid: req.body.uuid,
            version: 1
         });

         if (existing) {
            return res.status(409).json({
               success: false,
               message: 'Asset already exists'
            });
         }

         // Parse hardware JSON if provided
         let hardwareData = {};

         if (req.body.hardwareData) {
            hardwareData = extractData(req.body.hardwareData);
         }

         const asset = new Asset({
            name: req.body.name,
            uuid: req.body.uuid,
            version: 1,
            rack: rack._id,
            uPosition: req.body.uPosition,
            notes: req.body.notes,
            imported_json: req.body.hardwareData || '',

            // Add extracted hardware data
            ...hardwareData
         });

         const savedAsset = await asset.save();

         return res.status(201).json({
            success: true,
            body: savedAsset
         });
      } catch (err) {
         return res.status(400).json({
            success: false,
            message: err.message
         });
      }
   }
};
