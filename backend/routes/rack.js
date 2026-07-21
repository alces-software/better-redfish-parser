const express = require('express');
const Rack = require('../models/Rack');

const router = express.Router();

router.get('/', async (req, res) => {
   try {
      const racks = await Rack.find();
      res.json(racks);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
});

router.get('/latest', async (req, res) => {
   // For each uuid in the assets collection, get the latest asset based on the createdAt field and return it in an array.
   try {
      const latestAssets = await Asset.aggregate([
         {
            $sort: { createdAt: -1 }
         },
         {
            $group: {
               _id: '$uuid',
               doc: { $first: '$$ROOT' }
            }
         },
         {
            $replaceRoot: { newRoot: '$doc' }
         }
      ]);
      res.json(latestAssets);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
});

router.get('/:id', async (req, res) => {
   try {
      const rack = await Rack.findById(req.params.id);
      if (!rack) {
         return res.status(404).json({ message: 'Rack not found' });
      }
      res.json(rack);
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
});

router.post('/', async (req, res) => {
   const rack = new Rack({
      name: req.body.name,
      size: req.body.size,
      notes: req.body.notes
   });

   try {
      const newRack = await rack.save();
      res.status(201).json(newRack);
   } catch (err) {
      res.status(400).json({ message: err.message });
   }
});

router.put('/:id', async (req, res) => {
   try {
      const updatedRack = await Rack.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedRack) {
         return res.status(404).json({ message: 'Rack not found' });
      }
      res.json(updatedRack);
   } catch (err) {
      res.status(400).json({ message: err.message });
   }
});

router.delete('/:id', async (req, res) => {
   // Delete a rack by ID as well as all associated assets that are in that rack.
   try {
      const deletedRack = await Rack.findByIdAndDelete(req.params.id);
      if (!deletedRack) {
         return res.status(404).json({ message: 'Rack not found' });
      }
      // Get all assets associated with the deleted rack and get their uuids
      const assets = await Asset.find({ rack: deletedRack._id });
      const uuids = assets.map((asset) => asset.uuid);

      // Delete all assets with the same uuids as the assets associated with the deleted rack
      await Asset.deleteMany({ uuid: { $in: uuids } });
      res.json({ message: 'Rack deleted' });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
});

module.exports = router;
