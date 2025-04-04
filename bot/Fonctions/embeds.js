const { Client, GatewayIntentBits, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, ActivityType } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const date = require('../Fonctions/date');
const { log } = require('console');
const { getValidImageByType } = require('../Fonctions/imageUtils');

let endDate2;

client.login(process.env.TOKEN);

module.exports.Delete = Delete;
module.exports.Add = Add;
module.exports.embeds = embeds;
module.exports.refresh = refresh;

async function Add(obj, id) {
	if (obj.offerType === 'BASE_GAME') { obj.offerType = 'JEU' }
	// Création de l'embed du jeu
	const gameSheet = new EmbedBuilder()
		.setColor(obj.color)
		.setTitle(obj.title)
		.setURL(obj.link)
		.setAuthor({ name: `${obj.author} ( ${obj.offerType} )`, iconURL: 'https://ftp.nkconcept.fr/logoNK.png' })
		.setDescription(obj.description)
		.setThumbnail(obj.thumbnail)
		.addFields(
			{ name: 'Prix Original', value: `${obj.originalPrice / 100}€ ` },
			{ name: 'Début de la promo', value: date.FormatDate(obj.startDate), inline: false },
			{ name: 'Fin de la promo', value: date.FormatDate(obj.endDate), inline: false },
		)
		.setImage(obj.image)
		.setTimestamp()
		.setFooter({ text: 'Envoyé par EpicGames Bot', iconURL: 'https://ftp.nkconcept.fr/logoNK.png' });

	// Création du bouton "Ajouter à Epic Games"
	const button = new ButtonBuilder()
		.setLabel("Ajouter à Epic Games") // Texte du bouton
		.setStyle(ButtonStyle.Link) // Type de bouton (Lien)
		.setURL(obj.link) // Lien vers le jeu
		.setEmoji('👍'); // Ajoutez une emoji si souhaité

	if (obj.status === "currentGames") {
		const row = new ActionRowBuilder().addComponents(button); // Ajout du bouton dans une ligne
			// Envoi du message avec l'embed et le bouton
		const channel = await client.channels.fetch(id);
		await channel.send({ embeds: [gameSheet], components: [row] });
	}
	else {
		// Envoi du message avec l'embed et le bouton
		const channel = await client.channels.fetch(id);
		await channel.send({ embeds: [gameSheet] });
	}

	// Mise à jour du statut du bot avec la prochaine date de fin de promo
	if (obj.status === 'currentGames') {
		// Vérifie si endDate2 n'a pas encore été défini OU si la nouvelle date de fin est postérieure à l'actuelle
		if (!endDate2 || new Date(obj.endDate) > new Date(endDate2)) {
			endDate2 = obj.endDate; // Met à jour endDate2 avec la nouvelle date la plus récente

			// Modifie l'activité du bot pour afficher le temps restant avant la fin de la promo
			client.user.setActivity(`Prochain jeu : ${date.RemainingTime(endDate2)}`, { type: ActivityType.Custom });

			// Démarre ou met à jour la fonction récursive qui maintient l'affichage à jour
			activity(endDate2);
		}
	}

}

function refresh(obj) {
	if (obj.offerType === 'BASE_GAME') { obj.offerType = 'JEU' }
	// Mise à jour du statut du bot avec la prochaine date de fin de promo
	if (obj.status === 'currentGames') {
		// Vérifie si endDate2 n'a pas encore été défini OU si la nouvelle date de fin est postérieure à l'actuelle
		if (!endDate2 || new Date(obj.endDate) > new Date(endDate2)) {
			endDate2 = obj.endDate; // Met à jour endDate2 avec la nouvelle date la plus récente

			// Modifie l'activité du bot pour afficher le temps restant avant la fin de la promo
			client.user.setActivity(`Prochain jeu : ${date.RemainingTime(endDate2)}`, { type: ActivityType.Custom });

			// Démarre ou met à jour la fonction récursive qui maintient l'affichage à jour
			activity(endDate2);
		}
	}
}

let activityTimeout; // Stocke l'ID du setTimeout actif

function activity(endDate2) {
	// Si un timeout existe déjà, on l'annule avant d'en créer un nouveau
	if (activityTimeout) {
		clearTimeout(activityTimeout);
	}

	activityTimeout = setTimeout(() => {
		client.user.setActivity(`Prochain jeu : ${date.RemainingTime(endDate2)}`, { type: ActivityType.Custom });
		activity(endDate2); // Relance la fonction
	}, 60000);
}

async function Delete(id) {
	const channel = await client.channels.fetch(id);
	channel.messages.fetch({ limit: 10 }).then(messages => {
		const messagesToDelete = messages.filter(message => message.createdTimestamp > Date.now() - 1000 * 60 * 60 * 24 * 14);
		channel.bulkDelete(messagesToDelete);
	}).catch(console.error);
}

async function embeds(mess, id) {
	const embed = new EmbedBuilder()
		.setAuthor({ name: 'Bot EpicGames', iconURL: 'https://ftp.nkconcept.fr/logoNK.png' })
		.setTitle('Bot EpicGames!')
		.setDescription(mess)
		.setColor('#FF0000')
		.setTimestamp()
		.setFooter({ text: 'Envoyé par EpicGames Bot', iconURL: 'https://ftp.nkconcept.fr/logoNK.png' });

	const channel = await client.channels.fetch(id);
	await channel.send({ embeds: [embed] });
}
