const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

router.get('/', (req, res) => {
  try {
    const dataPath = path.join(__dirname, '../data/goods.json');
    const goods = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
    res.json(goods);
  } catch (err) {
    console.error('Error reading goods.json:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;
