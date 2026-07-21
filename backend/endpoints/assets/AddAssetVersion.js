const Asset = require('../../models/Asset');

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
         const current = await Asset.findOne({
            uuid: req.params.uuid
         }).sort({
            version: -1
         });

         if (!current) {
            return res.status(404).json({ success: false, message: 'Asset not found' });
         }

         const newVersion = new Asset({
            uuid: current.uuid,
            version: current.version + 1,

            name: req.body.name ?? current.name,
            rack: req.body.rack ?? current.rack,
            uPosition: req.body.uPosition ?? current.uPosition,
            notes: req.body.notes ?? current.notes
         });

         await newVersion.save();

         return res.status(201).json({ success: true, body: newVersion });
      } catch (err) {
         return res.status(500).json({ success: false, message: err.message });
      }
   }
};
