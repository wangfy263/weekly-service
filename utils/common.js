const moment = require('moment');
const common = {}

/** 枚举值对象列表，转成枚举值object */
common.arrayToMap = (array) => {
  let arr = array.map((item)=>{
    let map = {};
    let keys = Object.keys(item)
    map[item[keys[0]]] = item[keys[1]];
    return map;
  })
  return Object.assign(...arr);
}

common.arrayToMap2 = (array) => {
  let arr = array.map((item)=>{
    let map = {};
    let keys = Object.keys(item)
    map[item[keys[0]]] = item;
    return map;
  })
  return Object.assign(...arr);
}

/** 获取weekRange */
common.getWeekRange = () => {
  let start = moment().startOf('week').add(1, 'd').format('MMDD');
  let end = moment().endOf('week').subtract(1, 'd').format('MMDD');
  return start + "-" + end;
}

module.exports = common;