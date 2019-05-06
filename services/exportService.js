const retInfo = require('../utils/retInfo')
const exportExcel = require('../utils/exportExcel')
const SqliteDB = require('../utils/sqliteDB.js').SqliteDB;
const {
  export_condition,
  queryProjectsSql,
  querySummarizeSql,
  queryOutputSql,
  queryInterestSql,
  queryAssistSql
} = require('../utils/constant');
const {
  getWeekRange
} = require('../utils/common');

let sqliteDB = new SqliteDB();

const exportService = {};

// const condition = " where week_range =";

// const queryProjectsSql = "select * from weekly_report_projects";
// const querySummarizeSql = "select * from weekly_report_summarize";
// const queryOutputSql = "select * from weekly_report_output";
// const queryInterestSql = "select * from weekly_report_interest";
// const queryAssistSql = "select * from weekly_report_assist";

const queryWeeklyData = (table, weekRange) => {
  let sql = table + export_condition + weekRange;
  return new Promise((resolve, reject)=>{
    sqliteDB.queryData(sql, (data)=>{
      resolve(data);
    });
  })
}
// const property = ['staff_group', 'staff_base', 'staff_branch', 'staff_level', 'staff_type', 'project_state'];
exportService.export = async function (ctx, inputData) {
  // let weekRange = "0419-0426";
  let weekRange = inputData.week_range ? inputData.week_range : getWeekRange();
  await Promise.all([
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
      // console.log(project)
      let obj = {};
      obj.proType = project.project_type;
      obj.branch = ctx.session["staff_branch"][project.branch_id];
      obj.proName = project.project_name;
      obj.state = ctx.session["project_state"][project.project_state_id]
      obj.next = project.next_work;
      exportData.projects.push(obj);
    }
    for(let summarize of data[1]){
      // console.log(summarize)
      let obj = {};
      obj.name = summarize.staff_name;
      obj.proName = summarize.project_name;
      obj.type = summarize.work_type;
      obj.week = summarize.weekly_work;
      obj.nextWeek = summarize.next_weekly_work;
      exportData.summarizes.push(obj);
    }
    for(let output of data[2]){
      // console.log(output)
      let obj = {};
      obj.name = output.staff_name;
      obj.fileName = output.article_name;
      obj.url = output.article_url;
      exportData.outputs.push(obj);
    }
    for(let interest of data[3]){
      // console.log(interest);
      let obj = {};
      obj.name = interest.staff_name;
      obj.module = interest.interest_module;
      obj.technological = interest.interest_technic;
      obj.putInto = interest.interest_cost;
      obj.mouth = interest.interest_mouth;
      exportData.interests.push(obj);
    }
    for(let assist of data[4]) {
      // console.log(assist)
      let obj = {};
      obj.type = ctx.session['staff_group'][assist.group_id];
      obj.name = assist.staff_name;
      obj.branch = ctx.session['staff_branch'][assist.branch_id];
      obj.resolve = assist.assist_resolve;
      obj.url = assist.assist_url;
      exportData.assists.push(obj);
    }
    // console.log(exportData);
    exportExcel(exportData, '前端组周报test');
    return Promise.resolve();
  })
  retInfo.retCode = "000000";
  retInfo.retMsg = "导出excel成功";
  return retInfo;
}

module.exports = exportService;
