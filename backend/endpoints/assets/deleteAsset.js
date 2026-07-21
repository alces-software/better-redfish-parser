const Asset = require('../../models/Asset');

module.exports = {
   info: {
      method: 'DELETE',
      endpoint: '/:uuid'
   },
   /**
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @returns {Promise<void>}
    */
   async call(req, res) {
      try {
         const result = await Asset.deleteMany({ uuid: req.params.uuid });

         return res.json({ success: true, deleted: result.deletedCount });
      } catch (err) {
         return res.status(500).json({ success: false, message: err.message });
      }
   }
};
