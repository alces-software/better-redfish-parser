const Asset = require('../../models/Asset');

module.exports = {
   info: {
      method: 'GET',
      endpoint: '/latest'
   },
   /**
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @returns {Promise<void>}
    */
   async call(req, res) {
      try {
         const assets = await Asset.find().populate('rack').sort({ uuid: 1, version: -1 });

         return res.status(200).json({ success: true, body: assets });
      } catch (err) {
         return res.status(500).json({ success: false, message: err.message });
      }
   }
};
