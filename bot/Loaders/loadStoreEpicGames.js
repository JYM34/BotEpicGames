const { EpicFreeGames } = require('epic-free-games');
const epicFreeGames = new EpicFreeGames({ country: 'FR', locale: 'fr', includeAll: true });
const date = require('../Fonctions/date');
const config = require('../config');
const embeds = require('../Fonctions/embeds');
const file = require('../Fonctions/file');
const fs = require('fs');
const { getValidImageByType } = require('../Fonctions/imageUtils');


const { log } = require('console');

let debug = false;

if (debug) {
    module.exports.Start = Start2;
} else {
    module.exports.Start = Start;
    module.exports.Refresh = Refresh;
}

let gamesFound = [];


function Start() {
    Loader();
    var now = new Date();
    var millisTillMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0, 0, 0) - now;
    if (millisTillMidnight < 0) {
        millisTillMidnight += 86400000;
    }
    setTimeout(function () {
        Loader();
        setInterval(Loader, 86400000);
    }, millisTillMidnight);
}

function Start2() {
    Loader();

    setTimeout(function () {
        Loader();
        setInterval(Loader, 13000);
    }, 13000);
}

async function Refresh() {
    file.SaveFile('[]');
    Loader();
    var now = new Date();
    var millisTillMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 16, 0, 0, 0) - now;
    if (millisTillMidnight < 0) {
        millisTillMidnight += 86400000;
    }
    setTimeout(function () {
        Loader();
        setInterval(Loader, 86400000);
    }, millisTillMidnight);
}

async function Loader() {
    const { currentGames, nextGames } = await epicFreeGames.getGames();

    const currentGamesData = currentGames.map(game => {
        const gameData = {};
        gameData.title = game.title || "";
        gameData.description = game.description || "";
        gameData.offerType = game.offerType || "";
        gameData.status = 'currentGames';
        gameData.thumbnail = getValidImageByType(game.title, game.keyImages, 'Thumbnail');
        gameData.author = game.seller?.name || "";
        gameData.image = getValidImageByType(game.title, game.keyImages, 'OfferImageWide');
        gameData.startDate = game.promotions.promotionalOffers[0].promotionalOffers[0].startDate;
        gameData.endDate = game.promotions.promotionalOffers[0].promotionalOffers[0].endDate;
        gameData.originalPrice = game.price.totalPrice.originalPrice;
        gameData.discountPrice = game.price.totalPrice.discountPrice;
        gameData.color = 2123412;

        if (game.catalogNs?.mappings?.[0]?.pageSlug) {
            gameData.link = `https://store.epicgames.com/fr/p/${game.catalogNs.mappings[0].pageSlug}`;
        } else {
            gameData.link = 'https://store.epicgames.com/fr/free-games';
        }
        //const localDateTime = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
        //log(`${localDateTime} : Affichage des jeux trouvés`);
        //console.table(game.keyImages);

        return gameData;
    });

    const nextGamesData = nextGames.map(game => {
        const gameData = {};
        gameData.title = game.title || "";
        gameData.description = game.description || "";
        gameData.offerType = game.offerType || "";
        gameData.status = 'nextGames';
        gameData.thumbnail = getValidImageByType(game.title, game.keyImages, 'Thumbnail');
        gameData.author = game.seller?.name || "";
        gameData.image = getValidImageByType(game.title, game.keyImages, 'OfferImageWide');
        gameData.startDate = game.promotions.upcomingPromotionalOffers[0].promotionalOffers[0].startDate;
        gameData.endDate = game.promotions.upcomingPromotionalOffers[0].promotionalOffers[0].endDate;
        gameData.originalPrice = game.price.totalPrice.originalPrice;
        gameData.discountPrice = game.price.totalPrice.discountPrice;
        gameData.color = 10038562;

        if (game.catalogNs?.mappings?.[0]?.pageSlug) {
            gameData.link = `https://store.epicgames.com/fr/p/${game.catalogNs.mappings[0].pageSlug}`;
        } else {
            gameData.link = 'https://store.epicgames.com/fr/free-games';
        }

        //const localDateTime = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
        //log(`${localDateTime} : ${gameData.title}`);
        //console.table(game.keyImages);

        return gameData;
    });

    gamesFound = [];
    gamesFound.push(...currentGamesData, ...nextGamesData);
    GetGames(gamesFound);
}

function GetGames(gamesFound) {
    const localDateTime = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });
    let isNewGames = false;
    let rawdata = fs.readFileSync('./games.json');
    let previousFreeGames = JSON.parse(rawdata);

    if (previousFreeGames.length === 0) {
        gamesFound.forEach((game) => {
            log(`${localDateTime} : ${config.BLUE}EpicGamesStore${config.WHITE} ==> Nouveau jeu Gratuit : ${config.GREEN}${game.title}${config.WHITE}`);
        });
        isNewGames = true;
    } else {
        let titlesFound = gamesFound.map(game => game.title);
        let titlesPrevious = previousFreeGames.map(game => game.title);
        let titlesDiff = titlesFound.filter(title => !titlesPrevious.includes(title));

        if (titlesDiff.length > 0) {
            log(`${localDateTime} : ${config.BLUE}EpicGamesStore${config.WHITE} ==> Nouveaux jeux trouvés : ${config.BLUE}${titlesDiff.length}${config.WHITE} - ${config.GREEN}${titlesDiff.join(', ')}${config.WHITE}`);
            isNewGames = true;
        } else {
            log(`${localDateTime} : ${config.BLUE}EpicGamesStore${config.WHITE} ==> Aucun nouveau jeu disponible`);
            gamesFound.forEach((game) => {
                embeds.refresh(game)
            });
        }
    }

    if (isNewGames) {
        embeds.Delete(config.GuildID);
        embeds.Delete(config.GuildID2);
        gamesFound.forEach((game) => {
            if (game && game.status === "currentGames") {
                setTimeout(() => {
                    embeds.Add(game, config.GuildID);
                }, 4000);
            } else if (game) {
                setTimeout(() => {
                    embeds.Add(game, config.GuildID2);
                }, 5000);
            }
        });
        file.SaveFile(JSON.stringify(gamesFound));
        previousFreeGames = gamesFound;
    }

    log(`${localDateTime} : -------------------------`);
}
