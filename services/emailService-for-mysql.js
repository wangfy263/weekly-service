/**
 * 邮件组件应该只提供最基本的发邮件的能力；
 * 业务参数由service层传递。
 * 考虑到公司邮箱内网的情况，发件人邮箱统一设置；
 * 业务参数应该包含：
 *    1、收件人邮箱列表
 *    2、抄送人邮件列表
 *    3、发送主题
 *    4、邮件内容
 * 
 * 场景一：
 * 每周四， 下午3点， 定时发送邮件。 
 * 收件人：所有前端组同事。 
 * 主题：【 前端能开 & 技术栈 项目 双周报】 请To中各位 反馈本周周报， 明天下午17点前反馈。
 * 内容： 无
 * 
 * 场景二：
 * 每周五： 下午3点，查询当周周报发送情况，统计未发送的人员，发送提醒邮件
 * 收件人： 未发送当周周报的人员列表；
 * 主题： To中各位尚未发送本周周报，请于今日17点前发送周报。
 * 内容： 无
 */

const mail = require("../utils/email");
const mysqlDB = require('../utils/mysqlDB')
const {
  export_condition,
  nosend_condition,
  querySummarizeSql,
  queryEmailsSql
} = require('../utils/constant')

const {
  getWeekRange
} = require('../utils/common');


const emailService = {};

const staffWhoNoSend = async (weekRange) => {
  let staffs = new Set();
  let sql = querySummarizeSql + export_condition + "'" +weekRange + "'";
  let list = await queryWeeklyData(sql);
  for(let item of list){
    staffs.add(item.staff_id);
  }
  return Array.from(staffs);
}
const staffEmail = async (staffs) => {
  let staffStr = staffs.join(',');
  console.log(queryEmailsSql + nosend_condition + staffStr)
  let emails = await queryWeeklyData(queryEmailsSql + nosend_condition + '(' + staffStr + ')')
  let arr = [];
  for(email of emails){
    if(email.staff_email.indexOf('shenjb') === -1){
      arr.push(email.staff_email);
    }
  }
  return arr;
}

const queryWeeklyData = (sql) => {
  return mysqlDB.queryOnly(sql);
}

/**
 * 邮件通知周报未发的人员
 */
emailService.noWeeklyEmail = async function(ctx, data){
  let weekRange = null;
  if(data){
    weekRange = data.weekRange;
  }
  try{
    if(!weekRange){
      weekRange = getWeekRange();
    }
    let staffs = await staffWhoNoSend(weekRange);
    let emails = await staffEmail(staffs);
    console.log(emails)
    await mail.sendMail(emails, [], 'To中各位尚未发送本周周报，请于今日17点前发送周报', '');
    console.info("邮件通知成功")
  }catch(e){
    console.error(e);
  }
}

/**
 * 按周通知周报发送情况
 */
emailService.weeklyNoticeEmail = async function(){
  let emails = await queryWeeklyData(queryEmailsSql)
  let arr = [];
  for (email of emails) {
    if(email.staff_email.indexOf('shenjb') === -1){
      arr.push(email.staff_email);
    }
  }
  mail.sendMail(arr, [], '【前端能开&技术栈 项目周报】请To中各位及时填写本周周报，明天下午17点前统计，周报填写系统地址：http://47.104.199.74:8001/login', '');
}

/**
 * 指定提醒人
 */
emailService.noticeSomeOne = async function(ctx, email){
  const context = `${ctx.session.user.staff_name}【${ctx.session.user.staff_notes_id}】提醒您，请及时填写周报，系统地址：http://47.104.199.74:8001/login`
  mail.sendMail([email], [], context)
}
module.exports = emailService;