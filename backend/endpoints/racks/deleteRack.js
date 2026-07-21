const Rack = require('../../models/Rack'),
   Asset = require('../../models/Asset');

module.exports = {
   info: {
      method: 'DELETE',
      endpoint: '/:id'
   },
   /**
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @returns {Promise<void>}
    */
   async call(req, res) {
      try {
         const deletedRack = await Rack.findByIdAndDelete(req.params.id);
         if (!deletedRack) {
            return res.status(404).json({ success: false, message: 'Rack not found' });
         }
         // Get all assets associated with the deleted rack and get their uuids
         const assets = await Asset.find({ rack: deletedRack._id });
         const uuids = assets.map((asset) => asset.uuid);

         // Delete all assets with the same uuids as the assets associated with the deleted rack
         await Asset.deleteMany({ uuid: { $in: uuids } });
         return res.status(200).json({ success: true, message: 'Rack deleted' });
      } catch (err) {
         return res.status(500).json({ success: false, message: err.message });
      }
   }
};
