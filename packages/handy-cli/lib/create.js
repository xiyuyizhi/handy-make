const path = require("path");
const fs = require("fs-extra");
const execa = require("execa");
const chalk = require("chalk");
const inquirer = require("inquirer");
const { getModuleList } = require("../util/getModuleList");
const Confirm = require("./Confirm.js");
const Package = require("../util/package.js");
const symlink = require("handy-utils/symlink");
const DEV_DEBUG = process.env.NODE_ENV === "DEV" || process.env.NODE_ENV === "DEBUG";

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
  const { answers, plugins } = await confirm.confirm();
  const pkg = {
    name: appName,
    version: "0.0.1",
    dependencies: {},
    devDependencies: {
      "handy-service": "^0.0.1"
    },
    scripts: {
      start: "handy-service serve",
      build: "handy-service build"
    }
  };
  pkg.presets = answers;
  const ppk = new Package();
  ppk.write(path.resolve(appDir, "package.json"), JSON.stringify(pkg, null, 2));
  console.log(answers);

  // install devDependencies
  console.log("install devDependencies.....");
  if (DEV_DEBUG) {
    symlink(
      require.resolve("handy-service/bin/handy-service"),
      path.join(appDir, "node_modules", ".bin", "handy-service")
    );
  } else {
    execa.sync("npm", ["install"], {
      cwd: appDir,
      stdio: "inherit"
    });
  }

  plugins.forEach(modu => {
    require(modu)(appDir, answers);
  });

  console.log(answers);
}

module.exports = creator;
