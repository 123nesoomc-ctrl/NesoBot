const express = require('express');
const router = express.Router();
const Guild = require('../models/Guild');
const authMiddleware = require('../middleware/auth');

// Get settings
router.get('/:guildId', authMiddleware, async (req, res) => {
  try {
    const guild = await Guild.findOne({ guildId: req.params.guildId });
    if (!guild) {
      return res.status(404).json({ error: 'Guild not found' });
    }
    res.json(guild);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update settings
router.put('/:guildId', authMiddleware, async (req, res) => {
  try {
    const guild = await Guild.findOneAndUpdate(
      { guildId: req.params.guildId },
      req.body,
      { new: true }
    );

    res.json(guild);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
