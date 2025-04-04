const fs = require('fs')
const config = require('../config')


module.exports.TestFile = TestFile
module.exports.SaveFile = SaveFile

function TestFile() {
    var localDateTime = new Date().toLocaleString("fr-FR", {timeZone: "Europe/Paris"})
    fs.readFile('./games.json', 'utf8', (err, data) => {
        if (err) {
            console.log(`${localDateTime} : ${config.RED}TestFile ${config.WHITE} games.json n'existe pas!`)
            WriteFile()
        }
        else {
            if(!data) {
                console.log(`${localDateTime} : ${config.RED}TestFile ${config.WHITE} games.json existe mais pas conforme!`)
                WriteFile()
            }
            else {
                console.log(`${localDateTime} : ${config.BLUE}TestFile ${config.WHITE} ${config.GREEN}games.json ${config.WHITE}initialisé!`) 
            }
        }
    })
}
function WriteFile() {
    var localDateTime = new Date().toLocaleString("fr-FR", {timeZone: "Europe/Paris"})  
    fs.writeFile('./games.json', '[]', (err) => {
        if (err) {
            console.log(`${localDateTime} : ${config.RED}ERREUR : Initialisation imposible${config.WHITE}`)
        }
        else {
            console.log(`${localDateTime} : ${config.RED}Initialisation terminé${config.WHITE}`)
        }
    })
}

function SaveFile(obj) {
    var localDateTime = new Date().toLocaleString("fr-FR", {timeZone: "Europe/Paris"})
    fs.writeFile('./games.json', obj, (err) => {
        if (err) {
            console.log('writeFile ==> '+err)
        }
        else {
            console.log(`${localDateTime} : ${config.RED}Sauvegarde des changements terminé${config.WHITE}`)
            console.log(`${localDateTime} : -------------------------`)
        }
    })
}
