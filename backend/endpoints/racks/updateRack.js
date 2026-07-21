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
         const updatedRack = await Rack.findByIdAndUpdate(req.params.id, req.body, { new: true });

         if (!updatedRack) {
            return res.status(404).json({ success: false, message: 'Rack not found' });
         }

         return res.status(200).json({ success: true, body: updatedRack });
      } catch (err) {
         return res.status(500).json({ success: false, message: err.message });
      }
   }
};
