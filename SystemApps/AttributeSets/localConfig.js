var path = require('path')
var globalPath = "../../../globalComponents/views/Partials/"
var localPath = "./Partials/";

var AppConf = {
    head: globalPath + "head",
    header: localPath + "headerBar",
    mainBody: localPath + "body",
    footer: globalPath + "footer",
    scripts: globalPath + "scripts",
    background: "../../GlobalElements/views/BlueBackground/bluebackground.ejs",
    navbar: "../../GlobalElements/views/NavBar/navbar.ejs",
    selectImage: localPath + "selectImagePlugIn.ejs",
    simpleImage: localPath + "simpleImgPlugin.ejs"
}

module.exports = AppConf;