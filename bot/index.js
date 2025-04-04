// Importation des modules nécessaires de discord.js
const { Client, Collection, GatewayIntentBits, Partials } = require("discord.js");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent
    ],
    shards: "auto",  // La distribution automatique des shards est activée
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.ThreadMember
    ]
});

// Chargement des modules pour les commandes et les événements
const loadCommands = require('./Loaders/loadCommands');
const loadEvents = require('./Loaders/loadEvents');
const config = require('./config');
require('dotenv').config();  // Chargement des variables d'environnement à partir du fichier .env

client.commands = new Collection();  // Initialisation de la collection des commandes

// Obtention de la date et l'heure locale en France (utilisation de toLocaleString pour gérer le formatage)
const localDateTime = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

// Nettoyage de la console avant de commencer
console.clear();
console.log(`${config.WHITE}${localDateTime} : ${config.GREEN}Initialisation!${config.WHITE}`);

// Chargement des commandes
const commands = loadCommands(client);

// Fonction principale lorsque le bot est prêt
client.on("ready", async () => {
        let localDateTime = new Date().toLocaleString("fr-FR", {timeZone: "Europe/Paris"});
        console.log(`${localDateTime} : ${config.PINK}-------------------------${config.WHITE}`);
        console.log(`${localDateTime} : ${config.GREEN}Logged in${config.WHITE} as ${config.BLUE}${client.user.username}${config.WHITE}!`);
        console.log(`${localDateTime} : ${config.PINK}-------------------------${config.WHITE}`);
});

// Chargement des événements
loadEvents(client);

// Gestion des erreurs non gérées et exceptions
process.on("unhandledRejection", (e) => {
    console.error("Unhandled Promise Rejection:", e);
});

process.on("uncaughtException", (e) => {
    console.error("Uncaught Exception:", e);
});

process.on("uncaughtExceptionMonitor", (e) => {
    console.error("Uncaught Exception Monitor:", e);
});

// Connexion du bot avec le token depuis les variables d'environnement
client.login(process.env.TOKEN);
