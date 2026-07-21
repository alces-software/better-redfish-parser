const Asset = require('../../models/Asset'),
   Rack = require('../../models/Rack');

module.exports = {
   info: {
      method: 'GET'
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
               message: 'Asset already exists'
            });
         }

         const asset = new Asset({
            name: req.body.name,
            uuid: req.body.uuid,
            version: 1,
            rack: rack._id,
            uPosition: req.body.uPosition,
            notes: req.body.notes
         });

         const savedAsset = await asset.save();

         res.status(201).json(savedAsset);
      } catch (err) {
         res.status(400).json({
            message: err.message
         });
      }
   }
}