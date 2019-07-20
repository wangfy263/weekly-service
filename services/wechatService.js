'use strict'
const Wechat = require('wechat4u')
const fs = require('fs')
const request = require('request')

const wechatService = {};

wechatService.init = () => {
  const bot = new Wechat()
  bot.start()

  bot.on('uuid', uuid => {
    const qrUrl = 'https://login.weixin.qq.com/qrcode/' + uuid
    console.log('二维码链接：', qrUrl)
  })

  bot.on('login', () => {
    console.log('登录成功')
    console.log(bot.botData)
    // 保存数据，将数据序列化之后保存到任意位置
    // fs.writeFileSync('./sync-data.json', JSON.stringify(bot.botData))
  })
}

module.exports = wechatService;