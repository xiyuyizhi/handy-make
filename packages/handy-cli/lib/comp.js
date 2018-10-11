const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

module.exports = compName => {
  const compRoot = path.join(process.cwd(), compName);
  const compPath = path.join(compRoot, `${compName}.js`);
  const tempPath = path.join(__dirname, "../util/", "compTemp.js");

  if (fs.existsSync(compRoot)) {
    console.log(chalk.red("component already exist  in current dir,please change component name"));
    process.exit(1);
  }
  fs.ensureDirSync(compRoot);
  fs.ensureFileSync(compPath);
  let code = require(tempPath);

  code = code.replace(/_compName_/, compName);
  code = code.replace(/_displayName_/, compName);

  fs.writeFileSync(compPath, code);

  console.log(chalk.green("create new component success"));
};
