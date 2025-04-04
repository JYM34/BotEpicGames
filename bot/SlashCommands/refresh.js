const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const config = require("../config");
const EpicFreeGames = require('../Loaders/loadStoreEpicGames');

module.exports = {
    showHelp: true,
    category: "info",
    
    data: new SlashCommandBuilder()
        .setName("refresh")
        .setDescription("Recharge les jeux"),

    run: async (client, interaction) => {
        try {
            await interaction.deferReply(); // Évite le timeout en attendant EpicFreeGames
            let localDateTime = new Date().toLocaleString("fr-FR", {timeZone: "Europe/Paris"});

            // Vérifier si EpicFreeGames est bien chargé
            if (!EpicFreeGames || !EpicFreeGames.Start) {
                return interaction.editReply(`${config.WHITE}${localDateTime} : ❌ Erreur : EpicFreeGames n'est pas disponible.`);
            }

            await EpicFreeGames.Refresh(); // On attend la fin de l'exécution avant de répondre

            const embed = new EmbedBuilder()
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ size: 1024 }) })
                .setTitle('Refresh!')
                .setDescription(`Recharge les jeux Epic Games`)
                .setColor(config.color || "#5865F2")
                .setTimestamp()
                .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ size: 1024 }) });

            await interaction.editReply({ embeds: [embed] }); // On modifie la réponse après le traitement

        } catch (error) {
            let localDateTime = new Date().toLocaleString("fr-FR", {timeZone: "Europe/Paris"});
            console.error(`${config.WHITE}${localDateTime} : Erreur dans la commande ping2 :`, error);
            interaction.editReply(`${config.WHITE}${localDateTime} : ❌ Une erreur est survenue.`);
        }
    }
};