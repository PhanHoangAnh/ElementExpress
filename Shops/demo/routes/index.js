var express = require('express');
var router = express.Router();
var path = require("path");
var app = express();
var shopConfig = require("../localConfig");


app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'ejs');


/* GET home page. */
router.get('/', function (req, res, next) {  
  var head = shopConfig.head;
  console.log(head);
  res.render('index', {
      title: 'From Global Components',
      head: shopConfig.head,
      header: shopConfig.header,
      footer:shopConfig.footer,
    });
});

app.use(router);
module.exports = app;