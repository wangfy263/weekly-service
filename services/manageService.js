const RetInfo = require('../utils/retInfo')
const commonUtils = require('../utils/common')
const mysqlDB = require('../utils/mysqlDB')
const {
  queryProjects,
  queryProjectsById,
  queryUserALLSql,
  saveProjectSql,
  updProjectSql,
  delProjectSql
} = require('../utils/constant');
const manageService = {};

manageService.findByUserId = async function(ctx, data){
  let retInfo = new RetInfo();
  const user = ctx.session.user;
  const states = ctx.session['project_state'];
  const list = await findProjectsById(user.staff_id);
  if(list){
    let l = list.map(item=>{
      let obj = {}
      obj.name = item.project_name;
      obj.branch = `${item.branch_id}`
      obj.type = states[item.state_id]
      obj.next_work = ''
      obj.state = '1'
      return obj
    })
    retInfo.retCode = '000000';
    retInfo.retMsg = '查询指定staff的项目成功';
    retInfo.data = l;
    return retInfo;
  }
}

manageService.find = async function(ctx, data){
  let retInfo = new RetInfo();
  const branchs = ctx.session['staff_branch'];
  const states = ctx.session['project_state'];
  const list = await findProjectsAll();
  const users = await findStaffAll();
  const userMap = commonUtils.arrayToMap2(users)
  if(list){
    list.map(item=>{
      item.name = item.project_name;
      item.branch = branchs[item.branch_id]
      item.type = states[item.state_id]
      item.staffNoteId = userMap[item.staff_id].staff_notes_id
    })
    retInfo.retCode = '000000';
    retInfo.retMsg = '查询全部项目成功';
    retInfo.data = list;
  }
  return retInfo;
}

manageService.save = async function(ctx, data) {
  let retInfo = new RetInfo();
  let param = {};
  param.project_name = data.name;
  param.state_id = data.state_id;
  param.branch_id = data.branch_id;
  param.staff_id = data.staff_id;
  let qry = await saveProject(param)
  if(qry){
    retInfo.retCode = '000000';
    retInfo.retMsg = '保存成功';
  }
  return retInfo;
}

manageService.update = async function(ctx, data) {
  let retInfo = new RetInfo();
  let param = [];
  param.push(data.name);
  param.push(data.state_id);
  param.push(data.branch_id);
  param.push(data.staff_id);
  param.push(data.project_id);
  let qry = await updProject(param)
  if(qry){
    retInfo.retCode = '000000';
    retInfo.retMsg = '修改成功';
  }
  return retInfo;
}

manageService.delete = async function(ctx, data) {
  let retInfo = new RetInfo();
  let qry = await delProject(data.id)
  if(qry){
    retInfo.retCode = '000000';
    retInfo.retMsg = '删除成功';
  }
  return retInfo;
}

const findProjectsById = (id) => {
  return mysqlDB.queryOnly(queryProjectsById, id).catch(err => {
    console.log(err)
  });
}

const findProjectsAll = () => {
  return mysqlDB.queryOnly(queryProjects).catch(err => {
    console.log(err)
  });
}

const findStaffAll = () => {
  return mysqlDB.queryOnly(queryUserALLSql).catch(err => {
    console.log(err)
  })
}

const saveProject = (pro) => {
  return mysqlDB.queryOnly(saveProjectSql, pro).catch(err => {
    console.log(err)
  })
}

const updProject = (pro) => {
  console.log(saveProjectSql)
  console.log(pro)
  return mysqlDB.queryOnly(updProjectSql, pro).catch(err => {
    console.log(err)
  })
}

const delProject = (id) => {
  return mysqlDB.queryOnly(delProjectSql, id).catch(err => {
    console.log(err)
  })
}

module.exports = manageService