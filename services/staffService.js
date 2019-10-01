const RetInfo = require('../utils/retInfo')
const { getWeekRange } = require('../utils/common')
const mysqlDB = require('../utils/mysqlDB')
const {
  queryUserALLSql,
  saveStaffSql,
  updStaffSql,
  delStaffSql,
  querySummarizeSql,
  defaultPassword
} = require('../utils/constant');

const staffService = {};

staffService.find = async function(ctx, data){
  let retInfo = new RetInfo();
  const users = await findStaffAll();
  if(users && users.length > 0){
    const lst = await isSubmitWeekly(getWeekRange())
    console.log(lst)
    const userList = users.map((item) => {
      item.group_name = ctx.session['staff_group'][item.group_id]
      item.base_name = ctx.session['staff_base'][item.base_id]
      item.branch_name = ctx.session['staff_branch'][item.branch_id]
      item.level_name = ctx.session['staff_level'][item.level_id]
      item.type_name = ctx.session['staff_type'][item.type_id]
      item.isSubmit = lst.includes(item.staff_id) ? 0 : 1 
      return item
    })
    retInfo.retCode = '000000';
    retInfo.retMsg = '成功';
    retInfo.data = userList;
  }
  return retInfo;
}

staffService.save = async function(ctx, data){
  let retInfo = new RetInfo();
  let param = {};
  param.staff_name = data.staff_name;
  param.staff_notes_id = data.staff_notes_id;
  param.staff_email = data.staff_email;
  param.branch_id = data.branch_id;
  param.group_id = data.group_id;
  param.level_id = data.level_id;
  param.base_id = data.base_id;
  param.type_id = data.type_id;
  param.staff_password = defaultPassword;
  let qry = await saveStaff(param)
  if(qry){
    retInfo.retCode = '000000';
    retInfo.retMsg = '保存成功';
  }
  return retInfo;
}

staffService.upd = async function(ctx, data){
  let retInfo = new RetInfo();
  let param = [];
  param.push(data.staff_name);
  param.push(data.staff_notes_id);
  param.push(data.staff_email);
  param.push(data.group_id);
  param.push(data.base_id);
  param.push(data.branch_id);
  param.push(data.level_id);
  param.push(data.type_id);
  param.push(data.staff_id);
  console.log(param)
  let qry = await updStaff(param)
  if(qry){
    retInfo.retCode = '000000';
    retInfo.retMsg = '保存成功';
  }
  return retInfo;
}

staffService.del = async function(ctx, data){
  let retInfo = new RetInfo();
  console.log(data.id)
  let qry = await delStaff(data.id)
  if(qry){
    retInfo.retCode = '000000';
    retInfo.retMsg = '删除成功';
  }
  return retInfo;
}

const isSubmitWeekly = async (range) => {
  const list = await findSummarize(range)
  const set = new Set(list.map((item) => {
    return item.staff_id
  }))
  return Array.from(set)
}

const findStaffAll = () => {
  return mysqlDB.queryOnly(queryUserALLSql).catch(err => {
    console.log(err)
  })
}

const saveStaff = (pro) => {
  return mysqlDB.queryOnly(saveStaffSql, pro).catch(err => {
    console.log(err)
  })
}

const updStaff = (pro) => {
  return mysqlDB.queryOnly(updStaffSql, pro).catch(err => {
    console.log(err)
  })
}

const delStaff = (id) => {
  return mysqlDB.queryOnly(delStaffSql, id).catch(err => {
    console.log(err)
  })
}

const findSummarize = (weekRange) => {
  let condition = " where week_range = ?"
  return mysqlDB.queryOnly(querySummarizeSql + condition, weekRange).catch(err => {
    console.log(err)
  })
}

module.exports = staffService;