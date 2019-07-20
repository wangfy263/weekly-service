const router = require('koa-router')()
const wechatService = require('../services/wechatService');

router.prefix('/wechat')
/**
 * 启动微信
 */
router.post('/start', async (ctx, next) => {
  const data = ctx.request.body;
  const user = ctx.session.user;
  if(!user){
    ctx.body = {
      retCode: '999999',
      retMsg: '请先登录在访问'
    }
    return;
  }
  const retInfo = await wechatService.init();
  ctx.body = retInfo;
})



module.exports = router