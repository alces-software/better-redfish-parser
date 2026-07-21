const Asset = require('../../models/Asset');
const { extractData } = require('../../services/assetServices');

module.exports = {
   info: {
      method: 'POST',
      endpoint: '/:uuid'
   },

   /**
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @returns {Promise<void>}
    */
   async call(req, res) {
      try {
         const current = await Asset.findOne({
            uuid: req.params.uuid
         }).sort({
            version: -1
         });

         if (!current) {
            return res.status(404).json({ 
               success: false, 
               message: 'Asset not found' 
            });
         }

         // Parse hardware JSON if provided
         let hardwareData = {};

         if (req.body.hardwareData) {
            hardwareData = extractData(req.body.hardwareData);
         }

         const newVersion = new Asset({
            uuid: current.uuid,
            version: current.version + 1,

            // Keep existing values unless overwritten
            name: req.body.name ?? current.name,
            rack: req.body.rack ?? current.rack,
            uPosition: req.body.uPosition ?? current.uPosition,
            notes: req.body.notes ?? current.notes,

            // Store raw JSON
            imported_json: req.body.hardwareData ?? current.imported_json,

            // Store extracted hardware fields
            cores: hardwareData.cores ?? current.cores,
            processor_name: hardwareData.processor_name ?? current.processor_name,
            processor_count: hardwareData.processor_count ?? current.processor_count,
            memory: hardwareData.memory ?? current.memory,
            model: hardwareData.model ?? current.model,
            serial_number: hardwareData.serial_number ?? current.serial_number,
            manufacturer: hardwareData.manufacturer ?? current.manufacturer,
            led: hardwareData.led ?? current.led,
            description: hardwareData.description ?? current.description
         });

         await newVersion.save();

         return res.status(201).json({ 
            success: true, 
            body: newVersion 
         });

      } catch (err) {
         return res.status(500).json({ 
            success: false, 
            message: err.message 
         });
      }
   }
};
