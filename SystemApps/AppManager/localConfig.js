var path = require('path')
var globalPath = "../../../globalComponents/views/Partials/"
var localPath = "./Partials/";

var shopConf = {
    head: globalPath+"head",
    header: localPath +"headerBar", 
    mainBody: localPath + "body",   
    footer:globalPath+"footer",
    scripts: globalPath +"scripts"
}

module.exports = shopConf;