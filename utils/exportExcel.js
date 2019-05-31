const ejsexcel = require("ejsexcel");
const fs = require("fs");
const util = require("util");
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const sourceFileName = "./utils/test.xlsx";

module.exports = async function exportExcel (data, targetName) {
  try{
    let excelName =  targetName + "@" + data.week_range + ".xlsx";
    const exlBuf = await readFileAsync(sourceFileName);
    const exlBuf2 = await ejsexcel.renderExcel(exlBuf, data)
    console.log(exlBuf2)
    await writeFileAsync("./public/excel/" + targetName + "@" + data.week_range + ".xlsx", exlBuf2);
    return excelName;
  }catch(err) {
    console.error(err);
  }
}