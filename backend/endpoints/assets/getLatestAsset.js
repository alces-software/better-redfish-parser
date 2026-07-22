const mongoose = require('mongoose'),
   Asset = require('../../models/Asset');

module.exports = {
   info: {
      method: 'GET',
      endpoint: '/:uuid'
   },
   /**
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @returns {Promise<void>}
    */
   async call(req, res) {
      try {
         const asset = mongoose.Types.ObjectId.isValid(req.params.uuid)
            ? await Asset.findById(req.params.uuid).populate('rack')
            : await Asset.findOne({
                 uuid: req.params.uuid
              })
                 .sort({ version: -1 })
                 .populate('rack');

         if (!asset) {
            return res.status(404).json({ success: false, message: 'Asset not found' });
         }

         return res.status(200).json({ success: true, body: asset });
      } catch (err) {
         return res.status(500).json({ success: false, message: err.message });
      }
   }
};
