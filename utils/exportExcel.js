const ejsexcel = require("ejsexcel");
const fs = require("fs");

const sourceFileName = "./utils/test.xlsx";

const readModule = () => {
  return fs.readFileSync(sourceFileName);
}

const renderExcel = (data, targetName, exlBuf) => {
  let excelName =  targetName + "@" + data.week_range + ".xlsx";
  ejsexcel.renderExcel(exlBuf, data).then(function (exlBuf2) {
    fs.writeFileSync("./public/excel/" + targetName + "@" + data.week_range + ".xlsx", exlBuf2);
  }).catch(function (err) {
    console.error(err);
  });
  return excelName;
}

module.exports = function exportExcel (data, tfile) {
  const exlBuf = readModule();
  return renderExcel(data, tfile, exlBuf);
};