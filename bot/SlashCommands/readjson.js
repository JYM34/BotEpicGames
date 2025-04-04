const Discord = require('discord.js');
const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const fs = require('fs');
const config = require("../config");

module.exports = {
    showHelp: true,
    category: "info",
    
    data: new SlashCommandBuilder()
        .setName("readjson")
        .setDescription("Affiche le contenu du fichier JSON")
        .setDefaultMemberPermissions(Discord.PermissionFlagsBits.Administrator),
    
    run: async (client, interaction) => {

        // Fonction pour parser le contenu JSON
        function JsonParse() {
            return new Promise((resolve, reject) => {
                fs.readFile('./games.json', 'utf8', (err, data) => {
                    if (err) {
                        reject("Erreur lors de la lecture du fichier games.json");
                    } else if (!data) {
                        reject("Le fichier games.json est vide ou corrompu.");
                    } else {
                        try {
                            // Si le fichier existe et contient des données, on le parse
                            const parsedData = JSON.parse(data);
                            resolve(parsedData);
                        } catch (parseErr) {
                            reject("Erreur lors du parsing du fichier JSON.");
                        }
                    }
                });
            });
        }

        // Récupérer le contenu du fichier JSON
        try {
            const jsonData = await JsonParse();  // On attend que le fichier soit lu et parsé

            // Affichage du contenu JSON dans la console
            console.log("Contenu du fichier JSON :");
            console.log(JSON.stringify(jsonData, null, 2)); // Affiche dans la console sous une forme lisible

            // Transformer le JSON en chaîne pour l'afficher dans la description
            const jsonString = JSON.stringify(jsonData, null, 2);

            const embed = new EmbedBuilder()
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ size: 1024}) })
                .setTitle('Contenu du fichier JSON:')
                .setDescription(`Voici le contenu du fichier JSON :\n\`\`\`json\n${jsonString}\n\`\`\``)  // Afficher le JSON formaté dans un bloc de code
                .setColor(config.color)
                .setTimestamp()
                .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ size: 1024}) });

            interaction.reply({ embeds: [embed] });

        } catch (error) {
            // En cas d'erreur, on renvoie un message d'erreur
            const errorEmbed = new EmbedBuilder()
                .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ size: 1024}) })
                .setTitle('Erreur de lecture du fichier JSON')
                .setDescription(error)  // Ici, error est une chaîne, donc ça fonctionne
                .setColor('RED')
                .setTimestamp()
                .setFooter({ text: `${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ size: 1024}) });

            interaction.reply({ embeds: [errorEmbed] });
        }
    }
};
