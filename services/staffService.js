const RetInfo = require('../utils/retInfo')
const { getWeekRange } = require('../utils/common')
const mysqlDB = require('../utils/mysqlDB')
const {
  queryUserALLSql,
  saveStaffSql,
  saveRoleRelSql,
  updStaffSql,
  delStaffSql,
  querySummarizeSql,
  qryUserRolesql,
  delUserRoleSql,
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
      delete item.staff_password
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
  let list = [];
  param.staff_name = data.staff_name;
  param.staff_notes_id = data.staff_notes_id; 
  param.staff_email = data.staff_email;
  param.branch_id = data.branch_id;
  param.group_id = data.group_id;
  param.level_id = data.level_id;
  param.base_id = data.base_id;
  param.type_id = data.type_id;
  param.staff_password = defaultPassword;
  let roles = data.roles;
  if(roles.length === 0 ){
    retInfo.retCode = '-1';
    retInfo.retMsg = '角色信息错误';
    return retInfo;
  }
  let qry = await saveStaff(param)
  if(!qry){
    retInfo.retCode = '-1';
    retInfo.retMsg = '保存失败';
    return retInfo;
  }
  for(let i=0; i<roles.length; i++){
    list.push({
      role_id: roles[i],
      staff_id: qry.insertId
    })
  }
  await mysqlDB.transactionFunc([[saveRoleRelSql, list]]).then(() => {
    retInfo.retCode = "000000";
    retInfo.retMsg = "保存成功";
  }, (res) => {
    retInfo.retCode = "999999";
    retInfo.retMsg = "数据错误，保存失败";
  })
  return retInfo;
}

staffService.findRoles = async (ctx, data) => {
  let retInfo = new RetInfo();
  let id = data.staff_id;
  if(!id){
    return retInfo
  }
  let res = await findUserRoles(id)
  if(res){
    retInfo.retCode = "000000";
    retInfo.retMsg = "查询成功";
    retInfo.data = res;
  }
  return retInfo;
}

staffService.upd = async function(ctx, data){
  let retInfo = new RetInfo();
  let param = [];
  let list = [];
  param.push(data.staff_name);
  param.push(data.staff_notes_id);
  param.push(data.staff_email);
  param.push(data.group_id);
  param.push(data.base_id);
  param.push(data.branch_id);
  param.push(data.level_id);
  param.push(data.type_id);
  param.push(data.staff_id);
  let roles = data.roles;
  if(roles.length === 0 ){
    retInfo.retCode = '-1';
    retInfo.retMsg = '角色信息错误';
    return retInfo;
  }
  for(let i=0; i<roles.length; i++){
    list.push({
      role_id: roles[i],
      staff_id: data.staff_id
    })
  }
  // await delUserRoles(data.staff_id);
  await mysqlDB.transactionFunc([[delUserRoleSql, [data.staff_id]], [saveRoleRelSql, list], [updStaffSql, [param]]]).then(() => {
    retInfo.retCode = "000000";
    retInfo.retMsg = "保存成功";
  }, (res) => {
    retInfo.retCode = "999999";
    retInfo.retMsg = "数据错误，保存失败";
  })
  return retInfo;
  // let qry = await updStaff(param)
  // if(qry){
  //   retInfo.retCode = '000000';
  //   retInfo.retMsg = '保存成功';
  // }
  // return retInfo;
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

// const saveRole = (list) => {
//   return mysqlDB.transactionFunc(list).catch(err => {
//     console.log(err)
//   })
// }

// const updStaff = (pro) => {
//   return mysqlDB.queryOnly(updStaffSql, pro).catch(err => {
//     console.log(err)
//   })
// }

const delStaff = (id) => {
  return mysqlDB.queryOnly(delStaffSql, id).catch(err => {
    console.error(err)
  })
}

const findSummarize = (weekRange) => {
  let condition = " where week_range = ?"
  return mysqlDB.queryOnly(querySummarizeSql + condition, weekRange).catch(err => {
    console.error(err)
  })
}

const findUserRoles = (staffId) => {
  let condition = " where staff_id = ?"
  return mysqlDB.queryOnly(qryUserRolesql + condition, staffId).catch(err => {
    console.error(err)
  })
}
const delUserRoles = (staffId) => {
  return mysqlDB.queryOnly(delUserRoleSql, staffId).catch(err => {
    console.error(err)
  })
}

module.exports = staffService;