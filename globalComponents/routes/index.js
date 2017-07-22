var express = require('express');
var router = express.Router();
var path = require("path");
var app = express();

// Main router for each shop
var currentPath = process.cwd();
router.use(function (req, res, next) {
    
    if (!req.shopname) {
        mainPoin(req, res, next);
    } else {
        var nextPath = path.join(currentPath, "/Shops", req.shopname);
        var shopHandler = require(path.join(nextPath, "routes/index"));
        shopHandler(req, res, next);
    }
});

function mainPoin(req, res, next) {
    res.render('index', {
        title: 'Main Global Components'
    });
}

module.exports = router;