const crypto = require('crypto');
const fs = require('fs')

const publicKey = fs.readFileSync('/root/crypto/rsa_public_key.pem').toString('ascii');
const privateKey = fs.readFileSync('/root/crypto/rsa_private_key.pem').toString('ascii');
let cryptoUtil = {}
cryptoUtil.publicEncrypt = (data) => {
  return crypto.publicEncrypt(publicKey, Buffer.from(data)).toString('base64');
}

cryptoUtil.privateDecrypt = (encodeData) => {
  return crypto.privateDecrypt(privateKey, Buffer.from(encodeData.toString('base64'), 'base64'));
}

module.exports = cryptoUtil
