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
         const { uuid } = req.params || {};
         const { name, rack, uPosition, notes, hardwareData } = req.body || {};

         if (!uuid) {
            return res
               .status(400)
               .json({ success: false, message: 'Asset UUID missing from request' });
         }

         const current = await Asset.findOne({ uuid }).sort({ version: -1 });

         if (!current) {
            return res.status(404).json({
               success: false,
               message: 'Asset not found'
            });
         }

         // Parse hardware JSON if provided
         let extractHardwareData = {};

         if (hardwareData) {
            extractHardwareData = extractData(hardwareData);
         }

         const newVersion = new Asset({
            uuid: current.uuid,
            version: current.version + 1,
            name: name ?? current.name,
            rack: rack ?? current.rack,
            uPosition: uPosition ?? current.uPosition,
            notes: notes ?? current.notes,
            imported_json: hardwareData ?? current.imported_json,

            // Store extracted hardware fields
            cores: extractHardwareData.cores ?? current.cores,
            processor_name: extractHardwareData.processor_name ?? current.processor_name,
            processor_count: extractHardwareData.processor_count ?? current.processor_count,
            memory: extractHardwareData.memory ?? current.memory,
            model: extractHardwareData.model ?? current.model,
            serial_number: extractHardwareData.serial_number ?? current.serial_number,
            manufacturer: extractHardwareData.manufacturer ?? current.manufacturer,
            led: extractHardwareData.led ?? current.led,
            description: extractHardwareData.description ?? current.description
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
