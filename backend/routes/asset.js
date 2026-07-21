const express = require('express');
const Asset = require('../models/Asset');
const Rack = require('../models/Rack');

const router = express.Router();

// Create first version of an asset
router.post('/', async (req, res) => {
   try {
      const rack = await Rack.findById(req.body.rack);

      if (!rack) {
         return res.status(404).json({
            message: 'Rack not found'
         });
      }

      // Prevent creating a second "first version"
      const existing = await Asset.findOne({
         uuid: req.body.uuid,
         version: 1
      });

      if (existing) {
         return res.status(409).json({
            message: 'Asset already exists'
         });
      }

      const asset = new Asset({
         name: req.body.name,
         uuid: req.body.uuid,
         version: 1,
         rack: rack._id,
         uPosition: req.body.uPosition,
         notes: req.body.notes
      });

      const savedAsset = await asset.save();

      res.status(201).json(savedAsset);
   } catch (err) {
      res.status(400).json({
         message: err.message
      });
   }
});

// Create a new version
router.put('/:uuid', async (req, res) => {
   const current = await Asset.findOne({
      uuid: req.params.uuid
   }).sort({
      version: -1
   });

   if (!current) {
      return res.status(404).json({
         message: 'Asset not found'
      });
   }

   const newVersion = new Asset({
      uuid: current.uuid,
      version: current.version + 1,

      name: req.body.name ?? current.name,
      rack: req.body.rack ?? current.rack,
      uPosition: req.body.uPosition ?? current.uPosition,
      notes: req.body.notes ?? current.notes
   });

   await newVersion.save();

   res.status(201).json(newVersion);
});

// Delete an asset and all its history
router.delete('/:uuid', async (req, res) => {
   const result = await Asset.deleteMany({
      uuid: req.params.uuid
   });

   res.json({
      deleted: result.deletedCount
   });
});

module.exports = router;
