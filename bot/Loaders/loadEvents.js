const {readdirSync} = require('fs');
const config = require('../config');

module.exports = client => {
    //event-handler
    readdirSync('./Events').forEach(async file => {
        let localDateTime = new Date().toLocaleString("fr-FR", {timeZone: "Europe/Paris"});
        const event = require(`../Events/${file}`);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
        console.log(`${localDateTime} :${config.BLUE} Evènement ${config.GREEN}${file.slice(0, file.length - 3)}${config.WHITE} chargée avec succée !`)
    })
}