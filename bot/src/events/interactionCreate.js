module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (interaction.isCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: '❌ Komut çalıştırılırken hata oluştu!',
          ephemeral: true
        });
      }
    }

    if (interaction.isButton()) {
      const button = interaction.client.buttons.get(interaction.customId);
      if (!button) return;

      try {
        await button.execute(interaction);
      } catch (error) {
        console.error(error);
      }
    }

    if (interaction.isModalSubmit()) {
      const modal = interaction.client.modals.get(interaction.customId);
      if (!modal) return;

      try {
        await modal.execute(interaction);
      } catch (error) {
        console.error(error);
      }
    }
  }
};
