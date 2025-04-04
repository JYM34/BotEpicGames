const { InteractionType } = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
    name: 'interactionCreate',

    execute: async (interaction) => {
        const client = interaction.client;

        // Vérification du type d'interaction et que l'utilisateur n'est pas un bot
        if (interaction.type === InteractionType.ApplicationCommand && !interaction.user.bot) {
            try {
                // Parcourir les fichiers de la commande
                const commandFiles = readdirSync('./SlashCommands');
                const command = commandFiles
                    .map(file => require(`../SlashCommands/${file}`))  // Charger toutes les commandes
                    .find(cmd => cmd.data.name.toLowerCase() === interaction.commandName.toLowerCase());

                // Si la commande est trouvée, l'exécuter
                if (command) {
                    await SendDiscordMessage(client, interaction, '1077248923921555466');  // Envoi d'un message dans le channel de log
                    await command.run(client, interaction, interaction.options);  // Exécution de la commande
                }
            } catch (error) {
                console.error('Erreur lors de l\'exécution de la commande:', error);
                // Vous pouvez aussi envoyer un message d'erreur dans un canal spécifique
            }
        }
    }
};

// Fonction pour envoyer un message dans un canal spécifique
async function SendDiscordMessage(client, interaction, channelId) {
    try {
        const channel = await client.channels.fetch(channelId);  // Récupération du canal
        if (channel) {
            await channel.send(`${interaction.user.username} a utilisé la commande \`${interaction.commandName}\``);
        } else {
            console.error(`Le canal ${channelId} n'a pas pu être trouvé.`);
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
    }
}
