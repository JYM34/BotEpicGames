const { readdirSync } = require('fs');
const { REST, Routes } = require('discord.js');
const config = require('../config');

// Fonction utilitaire pour obtenir la date formatée
function getFormattedDate() {
    return new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
}

module.exports = async client => {
    const commands = [];

    // Vérifie si client.commands est bien défini
    if (!client.commands) client.commands = new Map();

    // Vérification que le dossier SlashCommands existe et est accessible
    try {
        const commandFiles = readdirSync('./SlashCommands').filter(file => file.endsWith('.js'));

        if (commandFiles.length === 0) {
            console.warn('⚠️ Aucune commande trouvée dans le dossier ./SlashCommands');
        }

        for (const file of commandFiles) {
            const localDateTime = getFormattedDate(); // Utilisation de la fonction pour récupérer la date formatée

            try {
                const command = require(`../SlashCommands/${file}`);
                if (!command.data || !command.run) {
                    console.warn(`❌ Commande ${file} invalide (pas de 'data' ou 'run')`);
                    continue;
                }

                commands.push(command.data.toJSON());
                client.commands.set(command.data.name, command);

                console.log(`${localDateTime} : ${config.BLUE}✅ Commande ${config.GREEN}${file.slice(0, -3)}${config.WHITE} chargée avec succès !`);
            } catch (error) {
                console.error(`❌ Erreur lors du chargement de ${file} :`, error);
            }
        }
    } catch (error) {
        console.error("❌ Erreur lors de la lecture du dossier ./SlashCommands :", error);
    }

    // Fonction pour enregistrer les commandes auprès de l'API Discord
    const registerCommands = async () => {
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
        const localDateTime = getFormattedDate();

        try {
            console.log(`${localDateTime} : 🔄 Mise à jour des commandes...`);
            await rest.put(
                Routes.applicationGuildCommands(config.clientId, config.guildId),
                { body: commands }
            );
            console.log(`${localDateTime} : ✅ Commandes enregistrées avec succès !`);
        } catch (error) {
            console.error(`${localDateTime} : ❌ Erreur lors de l'enregistrement des commandes :`, error);
        }
    };

    // Enregistrer les commandes
    await registerCommands();

    return commands;
};
