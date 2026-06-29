const express = require('express');
const router = express.Router();
const Guild = require('../models/Guild');
const authMiddleware = require('../middleware/auth');

// Get all managed guilds
router.get('/', authMiddleware, async (req, res) => {
  try {
    const guilds = await Guild.find({ ownerId: req.user.discordId });
    res.json(guilds);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guilds' });
  }
});

// Get guild by ID
router.get('/:guildId', authMiddleware, async (req, res) => {
  try {
    const guild = await Guild.findOne({ guildId: req.params.guildId });
    if (!guild) {
      return res.status(404).json({ error: 'Guild not found' });
    }
    res.json(guild);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch guild' });
  }
});

// Update guild settings
router.put('/:guildId', authMiddleware, async (req, res) => {
  try {
    const { guildId } = req.params;
    const updates = req.body;

    const guild = await Guild.findOneAndUpdate(
      { guildId },
      { ...updates, updatedAt: Date.now() },
      { new: true }
    );

    if (!guild) {
      return res.status(404).json({ error: 'Guild not found' });
    }

    res.json(guild);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update guild' });
  }
});

module.exports = router;
