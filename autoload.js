var fs = require('fs');
var keyPair = JSON.parse(fs.readFileSync('temp', 'utf8'));
var SSOServices = require("./Kernel/Libs/SS0Services");


// variables
global["keyPair"] = JSON.parse(fs.readFileSync('temp', 'utf8'));
global['jwtsecret'] = 'convitbuocloai1';

//public function
global['getToken'] = SSOServices.getToken;
global['checkToken'] = SSOServices.checkToken;