const express = require('express');
const router = express.Router();
const Guild = require('../models/Guild');
const authMiddleware = require('../middleware/auth');

// Get moderation settings
router.get('/:guildId', authMiddleware, async (req, res) => {
  try {
    const guild = await Guild.findOne({ guildId: req.params.guildId });
    if (!guild) {
      return res.status(404).json({ error: 'Guild not found' });
    }
    res.json(guild.moderation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch moderation settings' });
  }
});

// Update moderation
router.put('/:guildId', authMiddleware, async (req, res) => {
  try {
    const guild = await Guild.findOneAndUpdate(
      { guildId: req.params.guildId },
      { moderation: req.body },
      { new: true }
    );

    res.json(guild.moderation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update moderation' });
  }
});

module.exports = router;
