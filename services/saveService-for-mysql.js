const RetInfo = require('../utils/retInfo')
const mysqlDB = require('../utils/mysqlDB.js')
const {
  getWeekRange
} = require('../utils/common');

const saveService = {}
const insertProjectSql = "INSERT INTO weekly_report_projects SET ?";
const insertSummarizeSql = "INSERT INTO weekly_report_summarize SET ?";
const insertOutputSql = "INSERT INTO weekly_report_output SET ?";
const insertInterestSql = "INSERT INTO weekly_report_interest SET ?";
const insertAssistSql = "INSERT INTO weekly_report_assist SET ?";


saveService.entry = async (ctx, data) => {
  let retInfo = new RetInfo();
  data.week_range = data.week_range ? data.week_range : getWeekRange();
  console.log(`保存周期${data.week_range}`)
  const user = ctx.session.user;
  let projectDataList = []
  let summarizeDataList = []
  let outputDataList = []
  let interestDataList = []
  let assistDataList = []
  if(data.project.length > 0){
    data.project.forEach(item => {
      let projectData = {}
      projectData.staff_id = user.staff_id;
      projectData.project_type = item.type;
      projectData.branch_id = item.branch;
      projectData.project_name = item.name;
      projectData.project_state_id = item.state;
      projectData.next_work = item.next_work;
      projectData.week_range = data.week_range;
      projectDataList.push(projectData)
    })
  }
  if(data.summarize.length > 0){
    data.summarize.forEach(item => {
      let summarizeData = {}
      summarizeData.staff_id = user.staff_id;
      summarizeData.staff_name = user.staff_name;
      summarizeData.staff_notes_id = user.staff_notes_id;
      summarizeData.project_name = item.project_name;
      summarizeData.work_type = ctx.session["project_state"][item.work_type];
      summarizeData.week_range = data.week_range;
      summarizeData.weekly_work = item.weekly_work;
      summarizeData.next_weekly_work = item.next_weekly_work;
      summarizeDataList.push(summarizeData)
    })
  }
  if(data.output.length > 0){
    data.output.forEach(item => {
      let outputData = {}
      outputData.staff_id = user.staff_id;
      outputData.staff_name = user.staff_name;
      outputData.staff_notes_id = user.staff_notes_id;
      outputData.article_name = item.article_name;
      outputData.article_url = item.article_url;
      outputData.week_range = data.week_range;
      outputDataList.push(outputData)
    })
  }
  if(data.interest.length > 0){
    data.interest.forEach(item => {
      let interestData = {}
      interestData.staff_id = user.staff_id;
      interestData.staff_name = user.staff_name;
      interestData.staff_notes_id = user.staff_notes_id;
      interestData.week_range = data.week_range;
      interestData.interest_module = item.module;
      interestData.interest_technic = item.technic;
      interestData.interest_cost = item.cost;
      interestData.interest_mouth = item.mouth;
      interestDataList.push(interestData)
    })
  }
  if(data.assist.length > 0){
    data.assist.forEach(item => {
      let assistData = {}
      assistData.staff_id = user.staff_id;
      assistData.staff_name = user.staff_name;
      assistData.staff_notes_id = user.staff_notes_id;
      assistData.week_range = data.week_range;
      assistData.branch_id =  item.branch_id;
      assistData.group_id =  item.group_id;
      assistData.assist_resolve = item.resolve;
      assistData.assist_url = item.url;
      assistDataList.push(assistData)
    })
  }
  let list = [
    [insertProjectSql, projectDataList],
    [insertSummarizeSql, summarizeDataList]
  ]
  if(outputDataList.length>0){
    list.push([insertOutputSql, outputDataList])
  }
  if(interestDataList.length>0){
    list.push([insertInterestSql, interestDataList])
  }
  if(assistDataList.length>0){
    list.push([insertAssistSql, assistDataList])
  }
  await mysqlDB.transactionFunc(list).then(() => {
    retInfo.retCode = "000000";
    retInfo.retMsg = "保存成功";
  }, (res) => {
    retInfo.retCode = "999999";
    retInfo.retMsg = "数据错误，保存失败";
  })
  return retInfo
}

module.exports = saveService;