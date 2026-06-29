const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  guildId: { type: String, required: true },
  channelId: String,
  userId: String,
  username: String,
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  subject: String,
  messages: [],
  createdAt: { type: Date, default: Date.now },
  closedAt: Date
});

module.exports = mongoose.model('Ticket', ticketSchema);
