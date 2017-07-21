var express = require('express');
var router = express.Router();
var path = require("path");
var app = express();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'From Global Components' });
// });

var currentPath = process.cwd();

router.use(function (req, res, next) {
    var nextPath = path.join(currentPath, "/Shops", req.shopname);    
    var shopHandler = require(path.join(nextPath, "routes/index"));
    shopHandler(req, res, next);    
});

module.exports = router;