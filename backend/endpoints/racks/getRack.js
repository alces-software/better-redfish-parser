const Rack = require('../../models/Rack');

module.exports = {
   info: {
      method: 'GET',
      endpoint: '/:id'
   },
   /**
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @returns {Promise<void>}
    */
   async call(req, res) {
      try {
         const rack = await Rack.findById(req.params.id);

         if (!rack) {
            return res.status(404).json({ success: false, message: 'Rack not found' });
         }

         return res.status(200).json({ success: true, body: rack });
      } catch (err) {
         return res.status(500).json({ success: false, message: err.message });
      }
   }
};
