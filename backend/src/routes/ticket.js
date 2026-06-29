const express = require('express');
const router = express.Router();
const Ticket = require('../models/Ticket');
const authMiddleware = require('../middleware/auth');

// Create ticket
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { guildId, userId, username, subject } = req.body;

    const ticket = new Ticket({
      guildId,
      userId,
      username,
      subject
    });

    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ticket' });
  }
});

// Get tickets
router.get('/:guildId', authMiddleware, async (req, res) => {
  try {
    const tickets = await Ticket.find({ guildId: req.params.guildId });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Close ticket
router.post('/:ticketId/close', authMiddleware, async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.ticketId,
      { status: 'closed', closedAt: Date.now() },
      { new: true }
    );

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ error: 'Failed to close ticket' });
  }
});

module.exports = router;
