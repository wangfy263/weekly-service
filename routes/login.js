const router = require('koa-router')()
const loginService = require('../services/loginService');


router.prefix('/staff')

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

/* login */
router.post('/login', async (ctx, next) => {
  const data = ctx.request.body;
  const retInfo = await loginService.login(ctx, data.name, data.pwd);
  ctx.body = retInfo;
})

module.exports = router
