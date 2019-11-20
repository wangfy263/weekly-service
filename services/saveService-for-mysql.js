const RetInfo = require('../utils/retInfo')
const mysqlDB = require('../utils/mysqlDB.js')
const {
  getWeekRange
} = require('../utils/common');
const {
  queryUserALLSql,
  querySummarizeSql,
  queryProjectsSql,
  queryOutputSql,
  queryInterestSql,
  queryAssistSql
} = require('../utils/constant');

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

saveService.findWeeklyList = async (ctx, data) => {
  let retInfo = new RetInfo();
  let sums = await findSummarizeByStaff({staff_id: ctx.session.user.staff_id});
  if(sums && sums.length >= 0){
    retInfo.retCode = '000000';
    retInfo.retMsg = '成功';
    retInfo.data = sums;
  }
  return retInfo;
}

saveService.findWeeklyByStaffId = async (ctx, data) => {
  let retInfo = new RetInfo();
  let pro = {}
  if(!data.group_id && data.group_id !== 0){// 个人记录查询
    pro.staff_id = ctx.session.user.staff_id;
    pro.week = data.week;
  }
  if(data.group_id || data.group_id === 0){// 预览
    pro.group_id = data.group_id;
    pro.week = data.week;
  }

  let arr = await Promise.all([
    findProjectsByStaff(pro),
    findSummarizeByStaff(pro),
    findOutputByStaff(pro),
    findInterestByStaff(pro),
    findAssistByStaff(pro)
  ]).catch(err => {
    console.error(err)
  })
  let users = await findStaffAll()
  if(arr && arr.length >= 0){
    for(each of arr){
      if(!each){
        continue;
      }
      each.map((item) => {
        if(item.project_type) item.project_type_name = ctx.session['project_state'][item.project_type]
        if(item.branch_id) item.branch_name = ctx.session['staff_branch'][item.branch_id]
        if(item.project_state_id) {
          item.project_state_name = ctx.session['project_state'][item.project_state_id]
          // item.staff_name = ctx.session.user.staff_name
          item.staff_name = users.reduce((x, y) => {
            return x + (y.staff_id === item.staff_id ? y.staff_name : '')
          }, '')
        }
        if(item.group_id) item.group_name = ctx.session['staff_group'][item.group_id]
        if(item.branch_id) item.branch_name = ctx.session['staff_branch'][item.branch_id]
      })
    }
    retInfo.retCode = '000000';
    retInfo.retMsg = '查询成功';
    retInfo.data = arr;
  }
  return retInfo;
}

/**
 * 员工ID：staff_id
 * 群组ID：group_id
 * 周期：  week
 * @param {} pro 
 */
const findSummarizeByStaff = (pro) => {
  let condition = '';
  let params = [];
  if(pro.staff_id){
    condition = ' where staff_id = ?';
    params.push(pro.staff_id)
  } else if (!pro.staff_id && pro.group_id !== undefined && pro.group_id !== 0) {
    condition = ' where staff_id in (select staff_id from staff where group_id = ?)'
    params.push(pro.group_id)
  } else if (!pro.staff_id && pro.group_id !== undefined && pro.group_id === 0) {
    condition = ''
  } else {
    return Promise.reject('!Error, 条件异常！')
  }
  if(pro.week){
    if(condition){
      condition = condition + ' and week_range = ?'
    }else{
      condition = condition + ' where week_range = ?'
    }
    params.push(pro.week)
  }
  return mysqlDB.queryOnly(querySummarizeSql + condition, params).catch(err => {
    console.log(err)
  })
}

const findProjectsByStaff = (pro) => {
  let condition = '';
  let params = [];
  if(pro.staff_id){
    condition = ' where staff_id = ?';
    params.push(pro.staff_id)
  } else if (!pro.staff_id && pro.group_id !== undefined && pro.group_id !== 0) {
    condition = ' where staff_id in (select staff_id from staff where group_id = ?)'
    params.push(pro.group_id)
  } else if (!pro.staff_id && pro.group_id !== undefined && pro.group_id === 0) {
    condition = ''
  } else {
    return Promise.reject('!Error, 条件异常！')
  }
  if(pro.week){
    if(condition){
      condition = condition + ' and week_range = ?'
    }else{
      condition = condition + ' where week_range = ?'
    }
    params.push(pro.week)
  }
  return mysqlDB.queryOnly(queryProjectsSql + condition, params).catch(err => {
    console.log(err)
  })
}
const findOutputByStaff = (pro) => {
  let condition = '';
  let params = [];
  if(pro.staff_id){
    condition = ' where staff_id = ?';
    params.push(pro.staff_id)
  } else if (!pro.staff_id && pro.group_id !== undefined && pro.group_id !== 0) {
    condition = ' where staff_id in (select staff_id from staff where group_id = ?)'
    params.push(pro.group_id)
  } else if (!pro.staff_id && pro.group_id !== undefined && pro.group_id === 0) {
    condition = ''
  } else {
    return Promise.reject('!Error, 条件异常！')
  }
  if(pro.week){
    if(condition){
      condition = condition + ' and week_range = ?'
    }else{
      condition = condition + ' where week_range = ?'
    }
    params.push(pro.week)
  }
  return mysqlDB.queryOnly(queryOutputSql + condition, params).catch(err => {
    console.log(err)
  })
}
const findInterestByStaff = (pro) => {
  let condition = '';
  let params = [];
  if(pro.staff_id){
    condition = ' where staff_id = ?';
    params.push(pro.staff_id)
  } else if (!pro.staff_id && pro.group_id !== undefined && pro.group_id !== 0) {
    condition = ' where staff_id in (select staff_id from staff where group_id = ?)'
    params.push(pro.group_id)
  } else if (!pro.staff_id && pro.group_id !== undefined && pro.group_id === 0) {
    condition = ''
  } else {
    return Promise.reject('!Error, 条件异常！')
  }
  if(pro.week){
    if(condition){
      condition = condition + ' and week_range = ?'
    }else{
      condition = condition + ' where week_range = ?'
    }
    params.push(pro.week)
  }
  return mysqlDB.queryOnly(queryInterestSql + condition, params).catch(err => {
    console.log(err)
  })
}
const findAssistByStaff = (pro) => {
  let condition = '';
  let params = [];
  if(pro.staff_id){
    condition = ' where staff_id = ?';
    params.push(pro.staff_id)
  } else if (!pro.staff_id && pro.group_id !== undefined && pro.group_id !== 0) {
    condition = ' where staff_id in (select staff_id from staff where group_id = ?)'
    params.push(pro.group_id)
  } else if (!pro.staff_id && pro.group_id !== undefined && pro.group_id === 0) {
    condition = ''
  } else {
    return Promise.reject('!Error, 条件异常！')
  }
  if(pro.week){
    if(condition){
      condition = condition + ' and week_range = ?'
    }else{
      condition = condition + ' where week_range = ?'
    }
    params.push(pro.week)
  }
  return mysqlDB.queryOnly(queryAssistSql + condition, params).catch(err => {
    console.log(err)
  })
}

const findStaffAll = () => {
  return mysqlDB.queryOnly(queryUserALLSql).catch(err => {
    console.log(err)
  })
}

module.exports = saveService;