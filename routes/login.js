const router = require('koa-router')()
const loginService = require('../services/loginService-for-mysql');
// const loginService = require('../services/loginService');

router.prefix('/staff')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

/* login */
router.post('/login', async (ctx, next) => {
  const data = ctx.request.body;
  console.log(data);
  const retInfo = await loginService.login(ctx, data.name, data.pwd, data.captcha);
  ctx.body = retInfo;
})

/* getUserInfo */
router.post('/getUserInfo', async (ctx, next) => {
  // const data = ctx.request.body;
  const user = ctx.session.user;
  if(!user){
    ctx.body = {
      retCode: '999999',
      retMsg: '请先登录在访问'
    }
    return;
  }
  const access = ctx.session.access;
  user.access = access;
  const retInfo = {
    retCode : '000000',
    retMsg : '获取用户信息成功',
    data: user
  }
  ctx.body = retInfo;
})

router.post('/initEnum', async (ctx, next) => {
  const retInfo =  await loginService.initEnum();
  ctx.body = retInfo;
})

/* logout */
router.post('/logout', async (ctx, next) => {
  ctx.session.user = null;
  ctx.body = {
    retCode: '000000',
    retMsg: '退出成功'
  };
})

router.get('/captcha', async (ctx, next) => {
  ctx.body = await loginService.getCaptcha(ctx);
})

module.exports = router
