var express = require('express');
var router = express.Router();
var path = require("path");
var app = express();
var shopConfig = require("../localConfig");


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
router.get('/', function (req, res, next) {  
  var head = shopConfig.head;
  console.log(head);
  res.render('index', {
      title: 'Application Manager',
      head: shopConfig.head,
      header: shopConfig.header,
      body: shopConfig.mainBody,
      footer:shopConfig.footer,
      scripts: shopConfig.scripts,
      RSApublicKey: keyPair.public,
      data: setting,
    });
});

for (var i in setting) {
    if (setting[i].url == 'appManager') {
        router.use(path.join('/', setting[i].url), app);
    } else {
        router.use('/' + setting[i].url, require(path.join(setting[i].path, "index")));
    }
}

app.use(router);
module.exports = app;