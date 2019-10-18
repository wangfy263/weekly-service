const router = require('koa-router')()
const staffService = require('../services/staffService');
const emailService = require('../services/emailService-for-mysql');

router.prefix('/staff')

/* 人员列表查询 */
router.post('/findStaff', async (ctx, next) => {
  const data = ctx.request.body;
  const user = ctx.session.user;
  if(!user){
    ctx.body = {
      retCode: '999999',
      retMsg: '请先登录在访问'
    }
    return;
  }
  const retInfo = await staffService.find(ctx, data);
  ctx.body = retInfo;
})

/* 新增人员信息 */
router.post('/saveStaff', async (ctx, next) => {
  const data = ctx.request.body;
  const user = ctx.session.user;
  if(!user){
    ctx.body = {
      retCode: '999999',
      retMsg: '请先登录在访问'
    }
    return;
  }
  const retInfo = await staffService.save(ctx, data);
  ctx.body = retInfo;
})

router.post('/findRoles', async (ctx, next) => {
  const data = ctx.request.body;
  const user = ctx.session.user;
  if(!user){
    ctx.body = {
      retCode: '999999',
      retMsg: '请先登录在访问'
    }
    return;
  }
  const retInfo = await staffService.findRoles(ctx, data);
  ctx.body = retInfo;
})

/* 修改人员信息 */
router.post('/updStaff', async (ctx, next) => {
  const data = ctx.request.body;
  const user = ctx.session.user;
  if(!user){
    ctx.body = {
      retCode: '999999',
      retMsg: '请先登录在访问'
    }
    return;
  }
  const retInfo = await staffService.upd(ctx, data);
  ctx.body = retInfo;
})

/* 删除人员信息 */
router.post('/delStaff', async (ctx, next) => {
  const data = ctx.request.body;
  const user = ctx.session.user;
  if(!user){
    ctx.body = {
      retCode: '999999',
      retMsg: '请先登录在访问'
    }
    return;
  }
  const retInfo = await staffService.del(ctx, data);
  ctx.body = retInfo;
})

/* 提醒 */
router.post('/noticeSomeone', async (ctx, next) => {
  const data = ctx.request.body;
  const user = ctx.session.user;
  if(!user){
    ctx.body = {
      retCode: '999999',
      retMsg: '请先登录在访问'
    }
    return;
  }
  if(!data || !data.email){
    ctx.body = {
      retCode: '-1',
      retMsg: '参数错误'
    }
    return;
  }
  let retInfo = {}
  console.log(data.email)
  try {
    await emailService.noticeSomeOne(data.email, '请及时填写周报')
    retInfo = {
      retCode: '000000',
      retMsg: '成功'
    }
  } catch(e) {
    retInfo = {
      retCode: '-1',
      retMsg: '失败'
    }
  }
  ctx.body = retInfo
})

module.exports = router