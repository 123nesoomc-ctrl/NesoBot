const Guild = require('../models/Guild');

module.exports = {
  name: 'guildMemberAdd',
  async execute(member) {
    try {
      const guild = await Guild.findOne({ guildId: member.guild.id });
      if (!guild || !guild.autoRole?.enabled) return;

      const role = member.guild.roles.cache.get(guild.autoRole.roleId);
      if (role) {
        await member.roles.add(role);
      }
    } catch (error) {
      console.error(error);
    }
  }
};
