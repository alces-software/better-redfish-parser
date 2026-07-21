const Rack = require('../../models/Rack');

module.exports = {
   info: {
      method: 'PUT',
      endpoint: '/:id'
   },
   /**
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @returns {Promise<void>}
    */
   async call(req, res) {
      try {
         const { id } = req.params || {};
         const body = req.body || {};

         if (!id) {
            return res
               .status(400)
               .json({ success: false, message: 'Rack ID missing from request' });
         }

         const updatedRack = await Rack.findByIdAndUpdate(id, body, { new: true });

         if (!updatedRack) {
            return res.status(404).json({ success: false, message: 'Rack not found' });
         }

         return res.status(200).json({ success: true, body: updatedRack });
      } catch (err) {
         return res.status(500).json({ success: false, message: err.message });
      }
   }
};
