const RetInfo = require('../utils/retInfo')
const commonUtils = require('../utils/common')
const {
  property,
  queryUserSql,
  queryGroupSql,
  queryBaseSql,
  queryBranchSql,
  queryLevelSql,
  queryTypeSql,
  queryStateSql,
  queryUserAccessSql,
} = require('../utils/constant');
const {
  getWeekRange
} = require('../utils/common');
const mysqlDB = require('../utils/mysqlDB')

const loginService = {}

loginService.login = async (ctx, name, pwd) => {
  let retInfo = new RetInfo();
  let res = await queryLogin(name);
  if(!res || res.length === 0){ 
    retInfo.retMsg = '用户名不存在';
    return retInfo;
  }
  if (res[0].staff_password !== pwd) {
    retInfo.retMsg = "密码错误";
    return retInfo;
  }
  retInfo.retCode = '000000';
  retInfo.retMsg = '登录成功';
  retInfo.data = {
    weekRange: getWeekRange()
  }
  // ctx.session.user = res[0];
  await initSession(ctx, res[0]);
  return retInfo;
}

loginService.initEnum = async () => {
  let retInfo = new RetInfo();
  const enumerates = await initEnumerate();
  if (enumerates) {
    const proStateEnum = enumerates[0];
    const branchEnum = enumerates[1];
    const groupEnum = enumerates[2];
    const levelEnum = enumerates[3];
    const typeEnum = enumerates[4];
    const baseEnum = enumerates[5];
    const roleEnum = enumerates[6];
    retInfo.retCode = '000000';
    retInfo.retMsg = '查询初始化m';
    retInfo.data = {
      proStateEnum,
      branchEnum,
      groupEnum,
      levelEnum,
      typeEnum,
      baseEnum,
      roleEnum
    }
  }
  return retInfo;
}

const queryLogin = id => {
  return mysqlDB.queryOnly(queryUserSql, id).catch(err => {
    console.log(err)
  });
}


const initSession = async (ctx, user) => {
  // const arr = await Promise.all([queryGroup(user.group_id), queryBase(user.base_id), queryBranch(user.branch_id), queryLevel(user.level_id), queryType(user.type_id)]);
  const arr = await Promise.all([
    queryPromise(queryGroupSql), 
    queryPromise(queryBaseSql), 
    queryPromise(queryBranchSql), 
    queryPromise(queryLevelSql), 
    queryPromise(queryTypeSql),
    queryPromise(queryStateSql),
    queryPromise(queryUserAccessSql + user.staff_id)
  ])
  // console.log(arr);
  for(let i=0;i<arr.length-1;i++){
    let item = arr[i];
    for(obj of item){
      if (obj.group_id && obj.group_id === user.group_id) user.group = obj.group_name;
      if (obj.base_id && obj.base_id === user.base_id) user.base = obj.base_name;
      if (obj.branch_id && obj.branch_id === user.branch_id) user.branch = obj.branch_name;
      if (obj.level_id && obj.level_id === user.level_id) user.level = obj.level_name;
      if (obj.type_id && obj.type_id === user.type_id) user.type = obj.type_name;
    }
    ctx.session[property[i]] = commonUtils.arrayToMap(item);
  }
  ctx.session['pro_state'] = {'1': '正常', '2': '紧急'};
  console.log(arr[arr.length-1])
  ctx.session.access = arr[arr.length-1].map(item => {
    return item.role_code;
  })
  ctx.session.user = user;
}

const queryPromise = (sql) => {
  return mysqlDB.queryOnly(sql);
}

/**
 * 初始化枚举值
 */
const initEnumerate = async () => {
  return await Promise.all([
    queryPromise('select * from project_state'),
    queryPromise('select * from staff_branch'),
    queryPromise('select * from staff_group'),
    queryPromise('select * from staff_level'),
    queryPromise('select * from staff_type'),
    queryPromise('select * from staff_base'),
    queryPromise('select * from staff_role')
  ]).catch(err => {
    console.error(err)
  }) 
}

module.exports = loginService