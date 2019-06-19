const router = require('koa-router')()
const saveService = require('../services/saveService-for-mysql');
const exportService = require('../services/exportService-for-mysql');
const emailService = require('../services/emailService-for-mysql');
const manageService = require('../services/manageService');
// const saveService = require('../services/saveService');
// const exportService = require('../services/exportService');
// const emailService = require('../services/emailService');

router.prefix('/staff')

/* 保存周报 */
router.post('/save', async (ctx, next) => {
  const data = ctx.request.body;
  const user = ctx.session.user;
  if(!user){
    ctx.body = {
      retCode: '999999',
      retMsg: '请先登录在访问'
    }
    return;
  }
  const retInfo = await saveService.entry(ctx, data);
  ctx.body = retInfo;
})

/** 导出excel
 * 入参：{weekRange: '0419-0426'}
 */
router.post('/export', async (ctx, next) => {
  const data = ctx.request.body;
  const user = ctx.session.user;
  if(!user){
    ctx.body = {
      retCode: '999999',
      retMsg: '请先登录在访问'
    }
    return;
  }
  const retInfo = await exportService.export(ctx, data);
  console.log('end')
  ctx.body = retInfo;
})

router.post('/manageProject/find', async (ctx, next) => {
  const data = ctx.request.body;
  const user = ctx.session.user;
  if(!user){
    ctx.body = {
      retCode: '999999',
      retMsg: '请先登录在访问'
    }
    return;
  }
  const retInfo = await manageService.find(ctx, data);
  ctx.body = retInfo;
})

router.post('/manageProject/findByUserId', async (ctx, next) => {
  const data = ctx.request.body;
  const user = ctx.session.user;
  if(!user){
    ctx.body = {
      retCode: '999999',
      retMsg: '请先登录在访问'
    }
    return;
  }
  const retInfo = await manageService.findByUserId(ctx, data);
  ctx.body = retInfo;
})

router.post('/manageProject/save', async (ctx, next) => {
  const data = ctx.request.body;
  const user = ctx.session.user;
  if(!user){
    ctx.body = {
      retCode: '999999',
      retMsg: '请先登录在访问'
    }
    return;
  }
  const retInfo = await manageService.save(ctx, data);
  ctx.body = retInfo;
})

router.post('/manageProject/update', async (ctx, next) => {
  const data = ctx.request.body;
  const user = ctx.session.user;
  console.log(data)
  if(!user){
    ctx.body = {
      retCode: '999999',
      retMsg: '请先登录在访问'
    }
    return;
  }
  const retInfo = await manageService.update(ctx, data);
  ctx.body = retInfo;
})

router.post('/manageProject/delete', async (ctx, next) => {
  const data = ctx.request.body;
  const user = ctx.session.user;
  if(!user){
    ctx.body = {
      retCode: '999999',
      retMsg: '请先登录在访问'
    }
    return;
  }
  const retInfo = await manageService.delete(ctx, data);
  ctx.body = retInfo;
})

router.post('/sendEmail', async (ctx, next) => {
  const data = ctx.request.body;
  // const user = ctx.session.user;
  const retInfo = await emailService.noWeeklyEmail(ctx, data);
  ctx.body = retInfo;
})

module.exports = router