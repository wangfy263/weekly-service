const RetInfo = require('../utils/retInfo')
const exportExcel = require('../utils/exportExcel')
const mysqlDB = require('../utils/mysqlDB')
const {
  export_condition,
  queryProjectsSql,
  querySummarizeSql,
  queryOutputSql,
  queryInterestSql,
  queryAssistSql,
  queryStaffSql
} = require('../utils/constant');
const {
  getWeekRange
} = require('../utils/common');


const exportService = {};

const queryWeeklyData = (table, weekRange) => {
  let sql = `${table}${export_condition}'${weekRange}'`;
  return mysqlDB.queryOnly(sql).catch(err => {
    console.log(err)
  });
}

const queryUsers = () => {
  return mysqlDB.queryOnly(queryStaffSql).catch(err => {
    console.log(err)
  });
}
exportService.export = async function (ctx, inputData) {
  // let weekRange = "0419-0426";
  let retInfo = new RetInfo();
  let weekRange = inputData.week_range ? inputData.week_range : getWeekRange();
  let exportName = inputData.fileName ? inputData.fileName : '前端组周报'
  console.log(`导出周期${weekRange}`)
  let users = await queryUsers();
  let promiseAll = Promise.all([
    queryWeeklyData(queryProjectsSql, weekRange),
    queryWeeklyData(querySummarizeSql, weekRange),
    queryWeeklyData(queryOutputSql, weekRange),
    queryWeeklyData(queryInterestSql, weekRange),
    queryWeeklyData(queryAssistSql, weekRange),
  ])
  .then((data) => {
    let exportData = {};
    exportData.week_range = weekRange;
    exportData.projects = [];
    exportData.summarizes = [];
    exportData.outputs = [];
    exportData.interests = [];
    exportData.assists = [];
    for(let project of data[0]){
      let obj = {};
      obj.proType = ctx.session["project_state"][project.project_type];
      obj.branch = ctx.session["staff_branch"][project.branch_id];
      obj.proName = project.project_name;
      obj.state = ctx.session["pro_state"][project.project_state_id]
      obj.next = project.next_work;
      for( let item of users) {
        if(item.staff_id === project.staff_id){
          obj.name = item.staff_notes_id;
          break;
        }
      }
      exportData.projects.push(obj);
    }
    for(let summarize of data[1]){
      let obj = {};
      obj.name = summarize.staff_name;
      obj.proName = summarize.project_name;
      obj.type = summarize.work_type;
      obj.week = summarize.weekly_work;
      obj.nextWeek = summarize.next_weekly_work;
      exportData.summarizes.push(obj);
    }
    for(let output of data[2]){
      let obj = {};
      obj.name = output.staff_name;
      obj.fileName = output.article_name;
      obj.url = output.article_url;
      exportData.outputs.push(obj);
    }
    for(let interest of data[3]){
      let obj = {};
      obj.name = interest.staff_name;
      obj.module = interest.interest_module;
      obj.technological = interest.interest_technic;
      obj.putInto = interest.interest_cost;
      obj.mouth = interest.interest_mouth;
      exportData.interests.push(obj);
    }
    for(let assist of data[4]) {
      let obj = {};
      obj.type = ctx.session['staff_group'][assist.group_id];
      obj.name = assist.staff_name;
      obj.branch = ctx.session['staff_branch'][assist.branch_id];
      obj.resolve = assist.assist_resolve;
      obj.url = assist.assist_url;
      exportData.assists.push(obj);
    }
    return exportData;
  })
  let data = await promiseAll
  let excelName = await exportExcel(data, exportName);
  console.log(excelName)
  retInfo.retCode = "000000";
  retInfo.retMsg = "导出excel成功";
  retInfo.data = {
    excelName,
  }
  return retInfo;
}

module.exports = exportService;
