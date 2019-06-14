'use strict';

const nodemailer = require('nodemailer');
const cryptoUtil = require('./crypto/cryptoUtil');
const senderConfig = require('./config').senderConfig;


const sender = {};
sender.address = '"王飞宇" <wangfeiyu_@126.com>';
sender.user = cryptoUtil.privateDecrypt(senderConfig.user).toString();
sender.pass = cryptoUtil.privateDecrypt(senderConfig.pass).toString();

const mail = {}

/**
 * 参数验证
 * @param {*} receivers 
 * @param {*} ccs 
 * @param {*} subject 
 * @param {*} text 
 */
const inputCheck = (receivers,cc,subject, text) => {
  let result = true;
  if(!receivers instanceof Array || receivers.length === 0){
    result = false;
    console.error('收件人参数异常;');
  }
  return false
}

mail.sendMail = async function sendMail(receivers, cc, subject, text) {
  // Generate SMTP service account from ethereal.email
  console.log('Credentials obtained, sending message...');
  // NB! Store the account object values somewhere if you want
  // to re-use the same account for future mail deliveries
  // Create a SMTP transporter object
  let transporter = nodemailer.createTransport({
    service: '126', // 使用了内置传输发送邮件 查看支持列表：https://nodemailer.com/smtp/well-known/
    port: 25, // SMTP 端口
    secureConnection: false, // 使用了 SSL
    auth: {
      user: sender.user,
      pass: sender.pass,
    },
    logger: false,
    debug: false // include SMTP traffic in the logs
  }, {
    // default message fields
    // sender info
    from: sender.address // sender address
  });

  // Message object
  let message = {
    // Comma separated list of recipients
    // to: 'wangfy@si-tech.com.cn',
    to: receivers.join(','),

    cc: cc.join(','),
    // Subject of the message
    subject: subject,

    // plaintext body
    text: text
  };

  let info = await transporter.sendMail(message);

  console.log('Message sent successfully!');
  console.log(nodemailer.getTestMessageUrl(info));

  // only needed when using pooled connections
  transporter.close();
}

module.exports = mail;