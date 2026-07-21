const Asset = require('../../models/Asset');

module.exports = {
   info: {
      method: 'GET',
      endpoint: '/:uuid/history'
   },
   /**
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @returns {Promise<void>}
    */
   async call(req, res) {
      try {
         const assets = await Asset.find({
            uuid: req.params.uuid
         })
            .populate('rack')
            .sort({ version: -1 });

         if (!assets.length) {
            return res.status(404).json({ success: false, message: 'Asset not found' });
         }

         return res.status(200).json({ success: true, body: assets });
      } catch (err) {
         return res.status(500).json({ success: false, message: err.message });
      }
   }
};
