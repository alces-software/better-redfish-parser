const Asset = require('../../models/Asset');

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
         const { name, rack, uPosition, notes } = req.body || {};

         if (!uuid) {
            return res
               .status(400)
               .json({ success: false, message: 'Asset UUID missing from request' });
         }

         const current = await Asset.findOne({ uuid }).sort({ version: -1 });

         if (!current) {
            return res.status(404).json({ success: false, message: 'Asset not found' });
         }

         const newVersion = new Asset({
            uuid: current.uuid,
            version: current.version + 1,
            name: name ?? current.name,
            rack: rack ?? current.rack,
            uPosition: uPosition ?? current.uPosition,
            notes: notes ?? current.notes
         });

         await newVersion.save();

         return res.status(201).json({ success: true, body: newVersion });
      } catch (err) {
         return res.status(500).json({ success: false, message: err.message });
      }
   }
};
