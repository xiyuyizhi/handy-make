const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const { getModuleList } = require("../util/getModuleList");
const Confirm = require("./confirm.js");

async function creator(appName) {
  const addDir = path.resolve(process.cwd(), appName);

  if (fs.ensureDirSync(addDir)) {
    const { override } = await inquirer.prompt([
      {
        type: "confirm",
        name: "override",
        message: chalk.red(`当前目录 ${appName} 存在,是否覆盖?`)
      }
    ]);
    if (override) {
      fs.removeSync(addDir);
    } else {
      process.exit(1);
    }
  }
  const confirm = new Confirm(appName, getModuleList(path.resolve(__dirname, "../", "prompts")));
  confirm.confirm();
}

module.exports = creator;
