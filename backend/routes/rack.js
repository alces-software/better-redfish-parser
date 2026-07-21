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

module.exports = router;