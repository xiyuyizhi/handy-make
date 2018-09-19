const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");
const inquirer = require("inquirer");
const { getModuleList } = require("../util/getModuleList");
const Confirm = require("./confirm.js");
const Package = require("../util/package.js");
async function creator(appName) {
  const appDir = path.resolve(process.cwd(), appName);
  if (fs.existsSync(appDir)) {
    const { override } = await inquirer.prompt([
      {
        type: "confirm",
        name: "override",
        message: chalk.red(`当前目录 ${appName} 存在,是否覆盖?`)
      }
    ]);
    if (override) {
      fs.removeSync(appDir);
    } else {
      process.exit(1);
    }
  }
  fs.mkdirSync(appDir);
  const confirm = new Confirm(appName, getModuleList(path.resolve(__dirname, "../", "prompts")));
  const answers = await confirm.confirm();
  const pkg = {
    name: appName,
    version: "0.0.1",
    devDependencies: {},
    script: {
      start: "handy-service serve",
      build: "handy-service build"
    }
  };
  pkg.preset = answers;
  const package = new Package();
  package.write(path.resolve(appDir, "package.json"), JSON.stringify(pkg, null, 2));
  console.log(answers);
}

module.exports = creator;
