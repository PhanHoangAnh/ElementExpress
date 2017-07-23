var express = require('express');
var router = express.Router();
var path = require("path");
var app = express();

require("../../autoload");
// console.log(checkToken);
// Main router for each shop
var currentPath = process.cwd();
// app.set('views', path.join(__dirname, 'views'))
// app.set('views', './views')
// app.set('view engine', 'ejs');
// css and js return first here
// app.use('/', express.static('public'));

router.use("/checkToken", checkToken, function (req, res, next) {
    var sendObj = {};
    sendObj.errNum = 0;
    sendObj.errMessage = "Valid Token";
    // console.log("payload data", req.body.payload, req.body.uid);
    res.send(sendObj);
    res.end();
});

router.use("/checkAuth", checkToken, checkAuth, function (req, res, next) {
    var sendObj = {};
    sendObj.errNum = 0;
    sendObj.errMessage = "Valid Token";
    sendObj.auth = req.auth;
    // console.log("payload data", req.body.payload, req.body.uid);
    res.send(sendObj);
    res.end();
})

// var url = "template";
router.post("/getToken", getToken);
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
// app.use(router);
module.exports = router;