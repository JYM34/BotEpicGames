const { ActivityType } = require("discord.js");
const EpicFreeGames = require('../Loaders/loadStoreEpicGames');
const config = require('../config');
const file = require('../Fonctions/file');
require('dotenv').config();

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        // Définir le statut du bot
        client.user.setPresence({
            activities: [{ 
                name: 'Checking Epic Game Store', // Activité que le bot affiche
                type: ActivityType.Custom,  // Activité personnalisée (vous pouvez changer cela pour d'autres types)
            }],
            status: 'online',  // Le bot est en ligne
        });

        // Obtenir la date et l'heure locale en France (format français, fuseau horaire Europe/Paris)
        let localDateTime = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

        // Appeler une fonction de test de fichier (assurez-vous qu'elle est utile dans ce contexte)
        file.TestFile();  // Cette ligne pourrait être un point à vérifier, selon si la fonction `TestFile()` est nécessaire ici.

         // Démarrer la récupération des jeux gratuits Epic Games
        try {
            await EpicFreeGames.Start();
            console.log(`${localDateTime} : ${config.BLUE}EpicGamesStore${config.GREEN} ==> Started!${config.WHITE}`);
        } catch (error) {
            // Gestion d'erreur en cas de problème avec la fonction `Start()`
            console.error(`${localDateTime} : ${config.BLUE}EpicGamesStore ${config.RED} ==>Error starting Epic Free Games check: ${error.message}${config.WHITE}`);
        }
    }
};
