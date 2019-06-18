const RetInfo = require('../utils/retInfo')
const commonUtils = require('../utils/common')
const mysqlDB = require('../utils/mysqlDB')
const {
  queryProjects,
  queryProjectsById,
  queryUserALLSql
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
    return retInfo;
  }
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

module.exports = manageService