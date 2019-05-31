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
      summarizeData.work_type = item.work_type;
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
    data.interest.forEach(item => {
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

  // let obj1 = [projectData.staff_id, projectData.project_type, projectData.branch_id, projectData.project_name, projectData.project_state_id, projectData.next_work, projectData.week_range];
  // let obj2 = [summarizeData.staff_id, summarizeData.staff_name, summarizeData.staff_notes_id, summarizeData.project_name, summarizeData.work_type, summarizeData.week_range, summarizeData.weekly_work, summarizeData.next_weekly_work];
  // let obj3 = [outputData.staff_id, outputData.staff_name, outputData.staff_notes_id, outputData.article_name, outputData.article_url, outputData.week_range];
  // let obj4 = [interestData.staff_id, interestData.staff_name, interestData.staff_notes_id, interestData.week_range, interestData.interest_module, interestData.interest_technic, interestData.interest_cost, interestData.interest_mouth];
  // let obj5 = [assistData.staff_id, assistData.staff_name, assistData.staff_notes_id, assistData.week_range, assistData.group_id, assistData.branch_id, assistData.assist_resolve, assistData.assist_url]

  await sqliteDB.transactionFunc([
    [insertProject, projectDataList],
    [insertSummarize, summarizeDataList],
    [insertOutput, outputDataList],
    [insertInterest, interestDataList],
    [insertAssist, assistDataList]
  ]).then(() => {
    retInfo.retCode = "000000";
    retInfo.retMsg = "保存成功";
  }, () => {
    retInfo.retCode = "999999";
    retInfo.retMsg = "数据错误，保存失败";
  })
  return retInfo
}

const formatInput = data => {
  let input = ''
  if(data.length > 0){
    input = data.map(item => {
      return Object.values(item)
    })
  }
  console.log("====data====")
  console.log(input)
  return input
}
const formatSql = (sql,data) => {
  let formatSql = ''
  if(data.length > 0 && data[0] !== null){
    let keys = Object.keys(data[0])
    let insertStr = keys.map(item=>item.toUpperCase()).join(',')
    let start = sql.indexOf('(')
    let end = sql.indexOf(')')
    formatSql = sql.substr(0,start+1) + insertStr + sql.substring(end, sql.length);
  }
  return formatSql
}

const insertProject = data => {
  return new Promise((resolve,reject) => {
    // let obj = [
    //   [data.staff_id, data.project_type, data.branch_id, data.project_name, data.project_state_id, data.next_work, data.week_range]
    // ];
    let formatData = formatInput(data)
    let newSql = formatSql(insertProjectSql, data)
    sqliteDB.insertDataTransaction(newSql, formatData, (f) => {
      f ? reject() : resolve()
    });
  });
}
// let str = "('" + +"','" + +"','" + +"','" + +"')"
const insertSummarize = data => {
  return new Promise((resolve, reject) => {
    // let obj = [[data.staff_id, data.staff_name, data.staff_notes_id, data.project_name, data.work_type, data.week_range, data.weekly_work, data.next_weekly_work]]
    let formatData = formatInput(data)
    let newSql = formatSql(insertSummarizeSql, data)
    sqliteDB.insertDataTransaction(newSql, formatData, (f) => {
      f ? reject() : resolve()
    });
  });
}

const insertOutput = data => {
  return new Promise((resolve, reject) => {
    // let obj = [[data.staff_id, data.staff_name, data.staff_notes_id, data.article_name, data.article_url, data.week_range]]   
    let formatData = formatInput(data)
    let newSql = formatSql(insertOutputSql, data)
    if(data.length === 0){
      console.log("output 为空，不进行insert")
      resolve();
      return
    }
    sqliteDB.insertDataTransaction(newSql, formatData, (f) => {
      f ? reject() : resolve()
    });
  })
}

const insertInterest = data => {
  return new Promise((resolve, reject) => {
    let formatData = formatInput(data)
    let newSql = formatSql(insertInterestSql,data)
    if(data.length === 0){
      console.log("interest为空，不进行insert")
      resolve();
      return
    }
    //let obj = [[data.staff_id, data.staff_name, data.staff_notes_id, data.week_range, data.interest_module, data.interest_technic, data.interest_cost, data.interest_mouth]]
    sqliteDB.insertDataTransaction(newSql, formatData, (f) => {
      f ? reject() : resolve()
    });
  })
}

const insertAssist = data => {
  return new Promise((resolve, reject) => {
    let formatData = formatInput(data)
    let newSql = formatSql(insertAssistSql, data)
    if(data.length === 0){
      console.log("assist 为空，不进行insert")
      resolve();
      return
    }
    //let obj = [[data.staff_id, data.staff_name, data.staff_notes_id, data.week_range, data.group_id, data.branch_id, data.assist_resolve, data.assist_url]]
    sqliteDB.insertDataTransaction(newSql, formatData, (f) => {
      f ? reject() : resolve()
    });
  })
}

module.exports = saveService;