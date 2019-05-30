const RetInfo = require('../utils/retInfo')
const SqliteDB = require('../utils/sqliteDB.js').SqliteDB;
const {
  getWeekRange
} = require('../utils/common');
let sqliteDB = new SqliteDB();

const saveService = {}
const insertProjectSql = "INSERT INTO WEEKLY_REPORT_PROJECTS (STAFF_ID,PROJECT_TYPE,BRANCH_ID,PROJECT_NAME,PROJECT_STATE_ID,NEXT_WORK,WEEK_RANGE) VALUES(?,?,?,?,?,?,?)";
const insertSummarizeSql = "INSERT INTO WEEKLY_REPORT_SUMMARIZE (STAFF_ID,STAFF_NAME,STAFF_NOTES_ID,PROJECT_NAME,WORK_TYPE,WEEK_RANGE,WEEKLY_WORK,NEXT_WEEKLY_WORK) VALUES(?,?,?,?,?,?,?,?)";
const insertOutputSql = "INSERT INTO WEEKLY_REPORT_OUTPUT (STAFF_ID,STAFF_NAME,STAFF_NOTES_ID,ARTICLE_NAME,ARTICLE_URL,WEEK_RANGE) VALUES(?,?,?,?,?,?)";
const insertInterestSql = "INSERT INTO WEEKLY_REPORT_INTEREST (STAFF_ID,STAFF_NAME,STAFF_NOTES_ID,WEEK_RANGE,INTEREST_MODULE,INTEREST_TECHNIC,INTEREST_COST,INTEREST_MOUTH) VALUES(?,?,?,?,?,?,?,?)";
const insertAssistSql = "INSERT INTO WEEKLY_REPORT_ASSIST (STAFF_ID,STAFF_NAME,STAFF_NOTES_ID,WEEK_RANGE,GROUP_ID,BRANCH_ID,ASSIST_RESOLVE,ASSIST_URL) VALUES(?,?,?,?,?,?,?,?)";


saveService.entry = async (ctx, data) => {
  let retInfo = new RetInfo();
  data.week_range = data.week_range ? data.week_range : getWeekRange();
  console.log(`保存周期${data.week_range}`)
  const user = ctx.session.user;
  let projectData = {}
  let summarizeData = {}
  let outputData = {}
  let interestData = {}
  let assistData = {}
  projectData.staff_id = user.staff_id;
  projectData.project_type = data.project.type;
  projectData.branch_id = data.project.branch;
  projectData.project_name = data.project.name;
  projectData.project_state_id = data.project.state;
  projectData.next_work = data.project.next_work;
  projectData.week_range = data.week_range;

  summarizeData.staff_id = user.staff_id;
  summarizeData.staff_name = user.staff_name;
  summarizeData.staff_notes_id = user.staff_notes_id;
  summarizeData.project_name = data.summarize.project_name;
  summarizeData.work_type = data.summarize.work_type;
  summarizeData.week_range = data.week_range;
  summarizeData.weekly_work = data.summarize.weekly_work;
  summarizeData.next_weekly_work = data.summarize.next_weekly_work;

  outputData.staff_id = user.staff_id;
  outputData.staff_name = user.staff_name;
  outputData.staff_notes_id = user.staff_notes_id;
  outputData.article_name = data.output.article_name;
  outputData.article_url = data.output.article_url;
  outputData.week_range = data.week_range;

  interestData.staff_id = user.staff_id;
  interestData.staff_name = user.staff_name;
  interestData.staff_notes_id = user.staff_notes_id;
  interestData.week_range = data.week_range;
  interestData.interest_module = data.interest.module;
  interestData.interest_technic = data.interest.technic;
  interestData.interest_cost = data.interest.cost;
  interestData.interest_mouth = data.interest.mouth;

  assistData.staff_id = user.staff_id;
  assistData.staff_name = user.staff_name;
  assistData.staff_notes_id = user.staff_notes_id;
  assistData.week_range = data.week_range;
  assistData.branch_id =  data.assist.branch_id;
  assistData.group_id =  data.assist.group_id;
  assistData.assist_resolve = data.assist.resolve;
  assistData.assist_url = data.assist.url;

  console.log(summarizeData)

  // let obj1 = [projectData.staff_id, projectData.project_type, projectData.branch_id, projectData.project_name, projectData.project_state_id, projectData.next_work, projectData.week_range];
  // let obj2 = [summarizeData.staff_id, summarizeData.staff_name, summarizeData.staff_notes_id, summarizeData.project_name, summarizeData.work_type, summarizeData.week_range, summarizeData.weekly_work, summarizeData.next_weekly_work];
  // let obj3 = [outputData.staff_id, outputData.staff_name, outputData.staff_notes_id, outputData.article_name, outputData.article_url, outputData.week_range];
  // let obj4 = [interestData.staff_id, interestData.staff_name, interestData.staff_notes_id, interestData.week_range, interestData.interest_module, interestData.interest_technic, interestData.interest_cost, interestData.interest_mouth];
  // let obj5 = [assistData.staff_id, assistData.staff_name, assistData.staff_notes_id, assistData.week_range, assistData.group_id, assistData.branch_id, assistData.assist_resolve, assistData.assist_url]

  await sqliteDB.transactionFunc([
    [insertProject, projectData], 
    [insertSummarize, summarizeData],
    [insertOutput, outputData],
    [insertInterest, interestData],
    [insertAssist, assistData]
  ]).then(() => {
    retInfo.retCode = "000000";
    retInfo.retMsg = "保存成功";
  }, () => {
    retInfo.retCode = "999999";
    retInfo.retMsg = "数据错误，保存失败";
  })
  return retInfo
}


const insertProject = data => {
  return new Promise((resolve,reject) => {
    let obj = [
      [data.staff_id, data.project_type, data.branch_id, data.project_name, data.project_state_id, data.next_work, data.week_range]
    ];
    sqliteDB.insertDataTransaction(insertProjectSql, obj, (f) => {
      f ? reject() : resolve()
    });
  });
}
// let str = "('" + +"','" + +"','" + +"','" + +"')"
const insertSummarize = data => {
  return new Promise((resolve, reject) => {
    let obj = [[data.staff_id, data.staff_name, data.staff_notes_id, data.project_name, data.work_type, data.week_range, data.weekly_work, data.next_weekly_work]]
    console.log(obj)
    sqliteDB.insertDataTransaction(insertSummarizeSql, obj, (f) => {
      f ? reject() : resolve()
    });
  });
}

const insertOutput = data => {
  return new Promise((resolve, reject) => {
    if(!data.article_name || !data.article_url){
      resolve();
      return
    }
    let obj = [[data.staff_id, data.staff_name, data.staff_notes_id, data.article_name, data.article_url, data.week_range]]   
    sqliteDB.insertDataTransaction(insertOutputSql, obj, (f) => {
      f ? reject() : resolve()
    });
  })
}

const insertInterest = data => {
  return new Promise((resolve, reject) => {
    if(!data.interest_module || !data.interest_technic){
      resolve();
      return
    }
    let obj = [[data.staff_id, data.staff_name, data.staff_notes_id, data.week_range, data.interest_module, data.interest_technic, data.interest_cost, data.interest_mouth]]
    sqliteDB.insertDataTransaction(insertInterestSql, obj, (f) => {
      f ? reject() : resolve()
    });
  })
}

const insertAssist = data => {
  return new Promise((resolve, reject) => {
    if(!data.group_id || !data.branch_id || !data.assist_resolve || !data.assist_url){
      resolve();
      return
    }
    let obj = [[data.staff_id, data.staff_name, data.staff_notes_id, data.week_range, data.group_id, data.branch_id, data.assist_resolve, data.assist_url]]
    sqliteDB.insertDataTransaction(insertAssistSql, obj, (f) => {
      f ? reject() : resolve()
    });
  })
}

module.exports = saveService;