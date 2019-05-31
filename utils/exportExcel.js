const ejsexcel = require("ejsexcel");
const fs = require("fs");

const sourceFileName = "./utils/test.xlsx";

module.exports = async function exportExcel (data, targetName) {
  try{
    let excelName =  targetName + "@" + data.week_range + ".xlsx";
    const exlBuf = await fs.readFileSync(sourceFileName);
    const exlBuf2 = await ejsexcel.renderExcel(exlBuf, data)
    fs.writeFileSync("./public/excel/" + targetName + "@" + data.week_range + ".xlsx", exlBuf2);
    return excelName;
  }catch(err) {
    console.error(err);
  }
}