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
      const updatedRack = await Rack.findByIdAndUpdate(
         req.params.id,
         req.body,
         { new: true }
      );
      if (!updatedRack) {
         return res.status(404).json({ message: 'Rack not found' });
      }
      res.json(updatedRack);
   } catch (err) {
      res.status(400).json({ message: err.message });
   }
});

router.delete('/:id', async (req, res) => {
   try {
      const deletedRack = await Rack.findByIdAndDelete(req.params.id);
      if (!deletedRack) {
         return res.status(404).json({ message: 'Rack not found' });
      }
      res.json({ message: 'Rack deleted' });
   } catch (err) {
      res.status(500).json({ message: err.message });
   }
});

module.exports = router;
