const schedule = require('node-schedule');
const moment = require('moment');
const holidays = require('../utils/holidays');
const emailService = require('./emailService');

/**
 * 根据节假日自动通知任务；
 */
const scheduleCronstyle = () => {
  /**
   * 每天的15: 30 定时执行一次:
   * 获取当前日期，当前日期的下一日，当前日期的下两日；
   * 如果当前日是工作日，下一日是工作日，下两日是节假日，发送全体通知邮件。
   * 如果当前日是工作日，下一日是节假日，则查询是否还有未发送周报的人员，并发送通知邮件。
   */
  schedule.scheduleJob('0 30 15 * * *', () => {
    let date = obtainDate();
    if(date.current === '0' && date.next === '0' && date.next2 !== '0'){
      emailService.weeklyNoticeEmail()
    }
    if (date.current === '0' && date.next !== '0') {
      emailService.noWeeklyEmail()
    }
  });
}

const obtainDate = () => {
  let date = {};
  let current = moment().format('YYYYMM-DD');
  let next = moment().add(1, 'days').format('YYYYMM-DD');
  let next2 = moment().add(2, 'days').format('YYYYMM-DD');
  date.current = holidays[current.split('-')[0]][current.split('-')[1]];
  date.next = holidays[next.split('-')[0]][next.split('-')[1]];
  date.next2 = holidays[next2.split('-')[0]][next2.split('-')[1]];
  // console.log(date)
  return date;
}
scheduleCronstyle();

module.exports = null;