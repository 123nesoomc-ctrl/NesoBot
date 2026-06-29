const express = require('express');
const router = express.Router();
const Giveaway = require('../models/Giveaway');
const authMiddleware = require('../middleware/auth');

// Create giveaway
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { guildId, prize, winners, duration } = req.body;

    const giveaway = new Giveaway({
      guildId,
      prize,
      winners,
      host: req.user.discordId,
      endTime: new Date(Date.now() + duration * 1000)
    });

    await giveaway.save();
    res.json(giveaway);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create giveaway' });
  }
});

// Get giveaways
router.get('/:guildId', authMiddleware, async (req, res) => {
  try {
    const giveaways = await Giveaway.find({ guildId: req.params.guildId });
    res.json(giveaways);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch giveaways' });
  }
});

// End giveaway
router.post('/:giveawayId/end', authMiddleware, async (req, res) => {
  try {
    const giveaway = await Giveaway.findByIdAndUpdate(
      req.params.giveawayId,
      { status: 'ended' },
      { new: true }
    );

    res.json(giveaway);
  } catch (error) {
    res.status(500).json({ error: 'Failed to end giveaway' });
  }
});

module.exports = router;
