const date = require('../Fonctions/date')
const config = require('../config')

module.exports.FormatDate = FormatDate
module.exports.FormatDate2 = FormatDate2
module.exports.CompareDate = CompareDate
module.exports.RemainingTime = RemainingTime
module.exports.convertMsToDHMS = convertMsToDHMS

function FormatDate(d) {
    const date = new Date(d);
    const formattedDate = date.toLocaleString("fr-FR", {timeZone: "Europe/Paris"});
    return formattedDate
}

function FormatDate2(d) {
    const date = new Date(d);
    let day = date.getDate().toString().padStart(2, '0');  // Assurez-vous que le jour a deux chiffres
    let month = (date.getMonth() + 1).toString().padStart(2, '0');  // Le mois commence à 0, donc ajoutez 1
    let year = date.getFullYear();
    
    let formattedDate = `${day}/${month}/${year}`;    
    return formattedDate
}

function CompareDate(d1, d2) {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    let difference = date2.getTime() - date1.getTime();
    if(difference <= 0) {
        difference = 60*1000
    }
    return difference + 60*1000
}

function RemainingTime(t) {

    var localDateTime = new Date().toLocaleString("fr-FR", {timeZone: "Europe/Paris"})

    let time = date.CompareDate(new Date().toISOString(), t)
    time = time + 60000
    d = new Date(time)
    //console.log(`${RED} DEBUG ==>${new Date().toISOString()} / ${t}  ${WHITE}`)

    jour = d.getDate() -1 ; // on récupère le jour
    mois = d.getMonth(); // on récupère le nombre du mois (entre 0 et 11)
    heure = d.getHours(); // on récupère l'heure
    min = d.getMinutes(); // on récupère les minutes
    sec = d.getSeconds(); // on récupère les secondes

    return result = ""+jour+"j "+heure+"h "+min+"min "
    
    //console.log(`${localDateTime} : -------------------------`)
    console.log(`${localDateTime} : ${config.PINK}Timer${config.WHITE} ==> Temps avant MAJ => ${config.GREEN}${result} (${FormatDate(t)})${config.WHITE}`)
    //console.log(`${localDateTime} : -------------------------`)
}

function convertMsToDHMS(ms) {
    var localDateTime = new Date().toLocaleString("fr-FR", {timeZone: "Europe/Paris"})
    ms = Math.abs(ms);

    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    const remainingHours = hours % 24;
    const remainingMinutes = minutes % 60;
    const remainingSeconds = seconds % 60;
  
    result = "dans "+days+"j "+remainingHours+"h "+remainingMinutes+"min "+remainingSeconds+"s"
    console.log(`${localDateTime} : ${config.PINK}Timer${config.WHITE} ==> Temps avant MAJ => ${config.GREEN}${result} (${ms})${config.WHITE}`)

  }

function Test(t) {
    let time = date.CompareDate(new Date().toISOString(), t)
    d = new Date(time)
    var localDateTime = new Date().toLocaleString("fr-FR", {timeZone: "Europe/Paris"})

    jour = d.getDate() -1 ; // on récupère le jour
    mois = d.getMonth(); // on récupère le nombre du mois (entre 0 et 11)
    heure = d.getHours(); // on récupère l'heure
    min = d.getMinutes(); // on récupère les minutes
    sec = d.getSeconds(); // on récupère les secondes

    result = "dans "+jour+"j "+heure+"h "+min+"min "+sec+"s"
    console.log(`${localDateTime} : ${config.PINK}Timer${config.WHITE} ==> Temps avant MAJ => ${config.GREEN}${result} (${t})${config.WHITE}`)

}