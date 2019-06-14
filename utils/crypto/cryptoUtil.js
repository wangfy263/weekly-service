const crypto = require('crypto');
const fs = require('fs')

const exportKey = key => {
  if(process.env.NODE_ENV === 'development') {
    return fs.readFileSync(process.cwd() + '/utils/crypto/rsa_' + key + '_key.pem').toString('ascii');
  }
  if(process.env.NODE_ENV === 'production') {
    return fs.readFileSync('/root/crypto/rsa_' + key + '_key.pem').toString('ascii')
  }
  if(process.env.NODE_ENV === 'testing') {
    return fs.readFileSync(process.cwd()+'/utils/crypto/rsa_' + key + '_key.pem').toString('ascii')
  } 
}

const publicKey = exportKey('public');
const privateKey = exportKey('private');

let cryptoUtil = {}

cryptoUtil.publicEncrypt = (data) => {
  return crypto.publicEncrypt(publicKey, Buffer.from(data)).toString('base64');
}

cryptoUtil.privateDecrypt = (encodeData) => {
  return crypto.privateDecrypt(privateKey, Buffer.from(encodeData.toString('base64'), 'base64'));
}

module.exports = cryptoUtil
