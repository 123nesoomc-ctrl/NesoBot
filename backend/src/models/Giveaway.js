const mongoose = require('mongoose');

const giveawaySchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  messageId: String,
  channelId: String,
  prize: String,
  winners: { type: Number, default: 1 },
  participants: [],
  host: String,
  status: { type: String, enum: ['active', 'ended'], default: 'active' },
  endTime: Date,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Giveaway', giveawaySchema);
