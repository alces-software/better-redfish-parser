const Rack = require('../../models/Rack');

module.exports = {
   info: {
      method: 'GET'
   },
   /**
    * @param {import('express').Request} req
    * @param {import('express').Response} res
    * @returns {Promise<void>}
    */
   async call(req, res) {
      try {
         const racks = await Rack.find();

         return res.status(200).json({ success: true, body: racks });
      } catch (err) {
         return res.status(500).json({ success: false, message: err.message });
      }
   }
};
