var cryptoUtil = require('./postJson_withEncrypt.js');
var cryptico = require('cryptico');

var fs = require('fs');
var savedKeyPair = JSON.parse(fs.readFileSync('../../../../temp', 'utf8'));

var publicKey = savedKeyPair.public;


var mock_obj = {};
mock_obj.userName = "Nắng mưa là chuyện của trời, tao Đéo Quan tâm lắm đâu. Con vịt";
mock_obj.password = "tao Đéo Quan tâm"

var result = cryptoUtil.EncryptJSON(mock_obj, publicKey);

console.log('result: ', result);

// Decrypt result

console.log('PrivateKey: ', savedKeyPair.private);

var RSAKey = cryptico.RSAKey.parse(JSON.stringify(savedKeyPair.private));

var DecryptionResult = cryptico.decrypt(result, RSAKey);

console.log('DecryptionResult: ', decodeURI(DecryptionResult.plaintext));

var DecryptRSA = JSON.parse(decodeURI(DecryptionResult.plaintext));

var aes_key = DecryptRSA.key;

var aes_userName = DecryptRSA.userName;

var aes_password = DecryptRSA.password;

var userName = decodeURI(cryptico.decryptAESCBC(aes_userName, aes_key));
console.log('userName: ', userName);

var password = decodeURI(cryptico.decryptAESCBC(aes_password, aes_key));
console.log('password: ', password);