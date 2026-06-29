const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
  guildId: { type: String, required: true, unique: true },
  guildName: String,
  prefix: { type: String, default: '!' },
  ownerId: String,
  permissions: {
    administrator: [],
    moderator: [],
    member: []
  },
  giveaway: {
    enabled: { type: Boolean, default: false },
    roles: [],
    channels: []
  },
  ticket: {
    enabled: { type: Boolean, default: false },
    categoryId: String,
    roles: []
  },
  autoResponse: {
    enabled: { type: Boolean, default: false },
    responses: [{
      trigger: String,
      reply: String
    }]
  },
  autoRole: {
    enabled: { type: Boolean, default: false },
    roleId: String
  },
  moderation: {
    banWords: [],
    banLinks: { type: Boolean, default: false },
    antiSpam: { type: Boolean, default: false }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Guild', guildSchema);
