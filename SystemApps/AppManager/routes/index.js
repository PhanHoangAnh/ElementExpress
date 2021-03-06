var express = require('express');
var router = express.Router();
var path = require("path");
var app = express();
var AppConfig = require("../localConfig");


app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../public')));
//
var setting = requireUncached("../../setting.js");
router.use(function(req, res, next) {
    setting = requireUncached("../../setting.js");
    next();
});

function requireUncached(module) {
    delete require.cache[require.resolve(module)]
    return require(module)
};
/* GET home page. */
router.get('/', function (req, res, next) {  //    
  res.render('index', {
      title: 'Application Manager',
      head: AppConfig.head,
      header: AppConfig.header,
      body: AppConfig.mainBody,
      footer:AppConfig.footer,
      scripts: AppConfig.scripts,
      RSApublicKey: keyPair.public,
      data: setting,
    });
});

for (var i in setting) {
    // var path = "../../CreateOptionSets/routes"
    if (setting[i].url == '') {
        router.use(path.join('/', setting[i].path), app);
    } else {
        router.use('/' + setting[i].url, require(path.join(setting[i].path, "index")));
    }
}

app.use(router);
module.exports = app;