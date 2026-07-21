const Rack = require('../../models/Rack');

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
         const { name, size, notes } = req.body || {};
         const rack = new Rack({ name, size, notes });
         const newRack = await rack.save();
         return res.status(201).json({ success: true, body: newRack });
      } catch (err) {
         return res.status(500).json({ success: false, message: err.message });
      }
   }
};
