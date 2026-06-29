const Guild = require('../models/Guild');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;
    if (!message.guild) return;

    try {
      const guild = await Guild.findOne({ guildId: message.guildId });
      if (!guild) return;

      const prefix = guild.prefix || '!';
      if (!message.content.startsWith(prefix)) return;

      const args = message.content.slice(prefix.length).trim().split(/ +/);
      const command = args.shift().toLowerCase();

      // Help command
      if (command === 'yardım') {
        return message.reply({
          embeds: [{
            color: 0x5865F2,
            title: '📚 NesoBot Komutları',
            description: 'Kullanılabilir komutlar',
            fields: [
              { name: '🎁 Çekiliş', value: `${prefix}çekiliş - Çekiliş başlatır`, inline: false },
              { name: '🎫 Ticket', value: `${prefix}ticket - Ticket açar`, inline: false },
              { name: '⚙️ Ayarlar', value: 'Dashboard üzerinden ayarlanır', inline: false },
            ],
            timestamp: new Date(),
          }]
        });
      }

      // Auto Response
      if (guild.autoResponse?.enabled) {
        const response = guild.autoResponse.responses.find(
          r => message.content.toLowerCase().includes(r.trigger.toLowerCase())
        );
        if (response) {
          return message.reply(response.reply);
        }
      }

      // Moderation checks
      if (guild.moderation?.banLinks && /https?:\/\/.+/.test(message.content)) {
        await message.delete();
        return message.author.send('❌ Bu sunucuda link paylaşmak yasaktır!');
      }

    } catch (error) {
      console.error(error);
    }
  }
};
